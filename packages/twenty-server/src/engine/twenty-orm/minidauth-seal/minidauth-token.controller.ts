import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { type Request } from 'express';

import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { UserSessionCookieService } from 'src/engine/core-modules/user-session/services/user-session-cookie.service';
import { UserSessionService } from 'src/engine/core-modules/user-session/services/user-session.service';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import {
  minidauthSessionId,
  mintReaderToken,
} from 'src/engine/twenty-orm/minidauth-seal/minidauth-seal.util';

/**
 * Hands the authenticated browser what it needs to decrypt sealed fields itself: a short-lived token
 * that names the current user, minted from the verified session (never from anything the client sends).
 * The browser trades this for a session-bound doken and then decrypts client-side, so the server only
 * ever holds ciphertext. Off unless MINIDAUTH_SEAL_URL is set.
 *
 * <p>Minting is gated on a LIVE server-side session, not merely a request that passes the guard. A bare
 * access-token JWT verifies on signature and expiry alone (see AccessTokenService.validateToken), so a
 * token captured before logout would keep minting decryption sessions for the rest of its ~30-minute
 * life. We require the request to carry the session cookie and resolve it here: sign-out revokes the
 * session server-side, after which resolveSession throws and no new decryption session can be minted.
 */
@Controller('minidauth')
export class MinidauthTokenController {
  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly userSessionCookieService: UserSessionCookieService,
  ) {}

  @Get('user-token')
  @UseGuards(WorkspaceAuthGuard)
  async getUserToken(
    @Req() request: Request,
    // The browser's session public key, so the token is bound to it (cnf). The token is then useless
    // if captured: it can only mint a doken for this key, which the holder alone can prove.
    @Query('sessionKey') sessionKey?: string,
  ): Promise<{ userToken: string; sidecar: string; enabled: boolean }> {
    const ctx = getWorkspaceAuthContext();
    const uid = ctx.type === 'user' ? ctx.user.id : undefined;

    // A live session must back this request. The guard is satisfied by a bare access-token JWT, which
    // survives logout until it expires; resolving the session cookie ties minting to state that
    // sign-out actually clears, so a retained token stops working the moment the user logs out.
    const sessionToken =
      this.userSessionCookieService.extractSessionTokenFromRequest(request);
    const liveSessionUid = await this.resolveLiveSessionUid(sessionToken);

    // Only ever issue a session-BOUND token: without the browser's session key we would hand out an
    // unbound token that a separate client could rebind to its own key, so issue nothing instead.
    const canMint =
      Boolean(uid) &&
      liveSessionUid === uid &&
      typeof sessionKey === 'string' &&
      sessionKey.length > 0;

    // Tie the token to this app session (sid), so signing out revokes it in minidauth at once rather
    // than waiting for its short lifetime to run out.
    const sid = sessionToken ? minidauthSessionId(sessionToken) : undefined;

    return {
      enabled: Boolean(process.env.MINIDAUTH_SEAL_URL) && canMint,
      sidecar: process.env.MINIDAUTH_SEAL_URL ?? '',
      userToken: canMint ? mintReaderToken(uid as string, sessionKey, sid) : '',
    };
  }

  /** The user id of the live session backing this request, or undefined if there is no live session. */
  private async resolveLiveSessionUid(
    sessionToken: string | undefined,
  ): Promise<string | undefined> {
    if (!sessionToken) {
      return undefined;
    }

    try {
      const { payload } =
        await this.userSessionService.resolveSession(sessionToken);

      // sub is the user id on both access and workspace-agnostic payloads; userId is present on the
      // workspace-scoped access payload. Prefer sub so an agnostic session still cross-checks.
      return (
        (payload as { sub?: string; userId?: string }).sub ??
        (payload as { userId?: string }).userId
      );
    } catch {
      // resolveSession throws on a revoked or expired session — treat that as no live session.
      return undefined;
    }
  }
}
