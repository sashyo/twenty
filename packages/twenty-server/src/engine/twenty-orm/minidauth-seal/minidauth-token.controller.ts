import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { mintReaderToken } from 'src/engine/twenty-orm/minidauth-seal/minidauth-seal.util';

/**
 * Hands the authenticated browser what it needs to decrypt sealed fields itself: a short-lived token
 * that names the current user, minted from the verified session (never from anything the client sends).
 * The browser trades this for a session-bound doken and then decrypts client-side, so the server only
 * ever holds ciphertext. Off unless MINIDAUTH_SEAL_URL is set.
 */
@Controller('minidauth')
export class MinidauthTokenController {
  @Get('user-token')
  @UseGuards(WorkspaceAuthGuard)
  getUserToken(
    // The browser's session public key, so the token is bound to it (cnf). The token is then useless
    // if captured: it can only mint a doken for this key, which the holder alone can prove.
    @Query('sessionKey') sessionKey?: string,
  ): { userToken: string; sidecar: string; enabled: boolean } {
    const ctx = getWorkspaceAuthContext();
    const uid = ctx.type === 'user' ? ctx.user.id : undefined;
    // Only ever issue a session-BOUND token: without the browser's session key we would hand out an
    // unbound token that a separate client could rebind to its own key, so issue nothing instead.
    const canMint =
      Boolean(uid) && typeof sessionKey === 'string' && sessionKey.length > 0;

    return {
      enabled: Boolean(process.env.MINIDAUTH_SEAL_URL) && canMint,
      sidecar: process.env.MINIDAUTH_SEAL_URL ?? '',
      userToken: canMint ? mintReaderToken(uid as string, sessionKey) : '',
    };
  }
}
