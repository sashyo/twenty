import { ApolloLink } from '@apollo/client';
import { concatMap } from 'rxjs';

import { decryptInPlace } from './minidauthReveal';

/**
 * Decrypt minidauth-sealed (ms1:) fields in GraphQL responses, in the browser, before they reach the
 * UI. Placed early in the link chain so it sees the final response; it never blocks a response it
 * cannot decrypt (ciphertext just stays as-is). concatMap keeps responses in order.
 */
export const minidauthDecryptLink = new ApolloLink((operation, forward) =>
  forward(operation).pipe(
    concatMap(async (response) => {
      if (response.data) {
        await decryptInPlace(response.data);
      }
      return response;
    }),
  ),
);
