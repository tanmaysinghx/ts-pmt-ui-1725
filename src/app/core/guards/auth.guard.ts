import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { catchError, firstValueFrom, map, Observable, of } from "rxjs";
import { AuthService } from "../../features/auth/services/sso.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const token = this.authService.getAuthToken();
        const refreshToken = this.authService.getRefreshToken();
        if (token) {
            return this.authService.validateToken(token, "tanmaysinhx99@gmail.com").pipe(
                map(() => true),
                catchError(() => {
                    return this.redirectToSSO(state.url);
                })
            );
        } else if (refreshToken) {
            return this.authService.generateTokenFromRefreshToken().pipe(
                map((res) => {
                    this.authService.setToken(res.token, res.refreshToken);
                    return true;
                }),
                catchError(() => this.redirectToSSO(state.url))
            );
        } else {
            return this.redirectToSSO(state.url);
        }
    }

    private redirectToSSO(redirectUrl: string): Observable<boolean> {
        const ssoRedirect = `http://localhost:1725/sso?redirect=${encodeURIComponent(redirectUrl)}`;
        window.location.href = ssoRedirect;
        return of(false);
    }
}

