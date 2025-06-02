import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { AuthService } from '../../features/auth/services/sso.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const token = this.authService.getToken();
        const refreshToken = this.authService.getRefreshToken();
        if (!token && !refreshToken) {
            sessionStorage.setItem('redirectUrl', state.url);
            return this.router.parseUrl('/login');
        }
        try {
            const valid = await firstValueFrom(this.authService.isAuthenticated(token ?? '', refreshToken ?? ''));
            if (valid) {
                return true;
            } else {
                sessionStorage.setItem('redirectUrl', state.url);
                return this.router.parseUrl('/login');
            }
        } catch (err) {
            console.error('Error in auth check:', err);
            sessionStorage.setItem('redirectUrl', state.url);
            return this.router.parseUrl('/login');
        }
    }
}
