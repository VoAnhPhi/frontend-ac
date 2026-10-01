import { accessTokenMinutes, api } from '../../app/api';
import type { AuthTokens } from './authSlice';

export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image?: string;
  walletAddress?: string;
}

export interface Registration extends Credentials {
  walletAddress: string;
}

interface UserResponse extends Omit<User, 'walletAddress'> {
  crypto?: { wallet?: string };
}

// DummyJSON sends empty strings for the image and wallet of a user created with /users/add.
function toUser({ id, username, firstName, lastName, image, crypto }: UserResponse): User {
  return {
    id,
    username,
    firstName,
    lastName,
    image: image || undefined,
    walletAddress: crypto?.wallet || undefined,
  };
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthTokens, Credentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials, expiresInMins: accessTokenMinutes },
      }),
    }),
    // DummyJSON simulates the new user without storing it, so it cannot sign in afterwards.
    register: build.mutation<User, Registration>({
      query: ({ username, password, walletAddress }) => ({
        url: '/users/add',
        method: 'POST',
        body: { username, password, crypto: { wallet: walletAddress } },
      }),
      transformResponse: toUser,
    }),
    getMe: build.query<User, void>({
      query: () => '/auth/me',
      transformResponse: toUser,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;

export function fullName(user: User) {
  return `${user.firstName} ${user.lastName}`.trim() || user.username;
}
