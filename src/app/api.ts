import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  loggedOut,
  selectAccessToken,
  selectRefreshToken,
  tokensReceived,
  type AuthTokens,
} from '../features/auth/authSlice';
import type { AppDispatch, RootState } from './store';

export const accessTokenMinutes = 30;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  // Without a limit, a request the server never answers keeps the page loading forever.
  timeout: 15_000,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as RootState);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

type ApiBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;
type BaseQueryApi = Parameters<ApiBaseQuery>[1];
type ExtraOptions = Parameters<ApiBaseQuery>[2];

// Shared by every request that hits a 401 while one refresh is in flight.
let pendingRefresh: Promise<boolean> | null = null;

async function refreshSession(api: BaseQueryApi, extraOptions: ExtraOptions) {
  const refreshToken = selectRefreshToken(api.getState() as RootState);
  if (!refreshToken) return false;
  // The refresh token goes in the body: DummyJSON's cookies are third-party on our origin.
  const result = await rawBaseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      body: { refreshToken, expiresInMins: accessTokenMinutes },
    },
    api,
    extraOptions,
  );
  if (result.data) {
    api.dispatch(tokensReceived(result.data as AuthTokens));
    return true;
  }
  // A network failure is not a rejected session, so keep the tokens for the next attempt.
  if (result.error?.status === 401 || result.error?.status === 403) {
    api.dispatch(signOut());
  }
  return false;
}

const baseQueryWithReauth: ApiBaseQuery = async (args, api, extraOptions) => {
  if (pendingRefresh) await pendingRefresh;
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) return result;

  pendingRefresh ??= refreshSession(api, extraOptions).finally(() => {
    pendingRefresh = null;
  });
  return (await pendingRefresh) ? rawBaseQuery(args, api, extraOptions) : result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

// Both session changes clear the cache so one account never sees another account's data.
export function startSession(tokens: AuthTokens) {
  return (dispatch: AppDispatch) => {
    dispatch(api.util.resetApiState());
    dispatch(tokensReceived(tokens));
  };
}

export function signOut() {
  return (dispatch: AppDispatch) => {
    dispatch(loggedOut());
    dispatch(api.util.resetApiState());
  };
}

/** The part of an RTK Query hook result that a loading or error state needs. */
export interface QueryResult<T> {
  data?: T;
  error?: unknown;
  isError: boolean;
  refetch: () => unknown;
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) {
  if (typeof error !== 'object' || error === null || !('status' in error)) return fallback;
  if (error.status === 'FETCH_ERROR') return 'Cannot reach the server. Check your connection.';
  if (error.status === 'TIMEOUT_ERROR') return 'The server took too long to respond.';
  if (
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  )
    return error.data.message;
  return fallback;
}
