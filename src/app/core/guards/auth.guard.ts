import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../../features/auth/services/sso.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    private redirectToLogin(url: string): UrlTree {
        sessionStorage.setItem('redirectUrl', url);
        return this.router.parseUrl('/login');
    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        let token = this.authService.getToken();
        const refreshToken = this.authService.getRefreshToken();
        if (!token && !refreshToken) {
            return this.redirectToLogin(state.url);
        }
        if (refreshToken && !token) {
            try {
                interface TokenResponse {
                    data?: {
                        accessToken?: string;
                        [key: string]: any;
                    };
                    [key: string]: any;
                }
                const newToken = await firstValueFrom(this.authService.generateTokenFromRefreshToken()) as TokenResponse;
                if (newToken?.data?.accessToken) {
                    this.authService.setRefreshToken(newToken.data.accessToken);
                    token = newToken.data.accessToken;
                } else {
                    throw new Error('Invalid token response');
                }
            } catch (err) {
                console.error('Error generating token from refresh token:', err);
                return this.redirectToLogin(state.url);
            }
        }
        try {
            const valid = await firstValueFrom(this.authService.isAuthenticated(token ?? '', refreshToken ?? ''));
            return valid ? true : this.redirectToLogin(state.url);
        } catch (err) {
            console.error('Error in auth check:', err);
            return this.redirectToLogin(state.url);
        }
    }
}
