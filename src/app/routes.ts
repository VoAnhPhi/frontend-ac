export const appHome = '/token/create';
export const signInPath = '/?dialog=signin';

/** Where to go after sign-in: the page the route guard sent the user away from, if any. */
export function redirectTarget(state: unknown) {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('/')
  )
    return state.from;
  return appHome;
}
