import { Routes } from '@angular/router';
import { SsoComponent } from './features/auth/components/sso/sso.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { LayoutUserComponent } from './layouts/layout-user/layout-user.component';
import { LayoutPreloginComponent } from './layouts/layout-prelogin/layout-prelogin.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardUserComponent } from './features/dashboard/components/dashboard-user/dashboard-user.component';

export const routes: Routes = [
    {
        path: 'sso',
        component: LayoutPreloginComponent,
        children: [{ path: '', component: SsoComponent }]
    },
    {
        path: 'login',
        component: LayoutPreloginComponent,
        children: [{ path: '', component: LoginComponent }]
    },
    {
        path: '',
        component: LayoutUserComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardUserComponent },
            // more authenticated routes here...
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
];
