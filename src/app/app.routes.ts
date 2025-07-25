import { Routes } from '@angular/router';
import { SsoComponent } from './features/auth/components/sso/sso.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { LayoutUserComponent } from './layouts/layout-user/layout-user.component';
import { LayoutPreloginComponent } from './layouts/layout-prelogin/layout-prelogin.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardUserComponent } from './features/dashboard/components/dashboard-user/dashboard-user.component';
import { CreateTicketComponent } from './features/tickets/create-ticket/create-ticket.component';
import { ViewTicketsComponent } from './features/tickets/view-tickets/view-tickets.component';
import { SearchTicketsComponent } from './features/tickets/search-tickets/search-tickets.component';
import { TicketDescriptionComponent } from './features/tickets/ticket-description/ticket-description.component';
import { AssignedTicketsComponent } from './features/tickets/assigned-tickets/assigned-tickets.component';
import { ViewProfileComponent } from './features/profile/view-profile/view-profile.component';

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

            /* Ticket Feature Routes */
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'tickets/create-ticket', component: CreateTicketComponent },
            { path: 'tickets/view-tickets', component: ViewTicketsComponent },
            { path: 'tickets/search-ticket', component: SearchTicketsComponent },
            { path: 'tickets/ticket-description/:ticketId', component: TicketDescriptionComponent },
            { path: 'tickets/assigned-tickets', component: AssignedTicketsComponent },

            /* Profle Feature Routes */
            { path: 'profile/view', component: ViewProfileComponent },
            { path: 'profile/edit', component: ViewProfileComponent },
        ]
    },
];
