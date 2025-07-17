import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from "../../pipes/safe-html.pipe";

interface MenuItem {
  id?: string;
  name: string;
  route?: string;
  icon: string;
  isActive?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-left-menu',
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.scss',
})
export class LeftMenuComponent {

  @Input() menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      route: '/dashboard',
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
      isActive: true
    },
    {
      id: "tickets",
      name: "Tickets",
      icon: "<path d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z' />",
      children: [
        {
          name: "Create Ticket",
          route: "/tickets/create-ticket",
          icon: "<path d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z' />",

        },
        {
          name: "View Tickets",
          route: "/tickets/view-tickets",
          icon: "<path d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z'/>"
        },
        {
          name: "Search Tickets",
          route: "/tickets/search-ticket",
          icon: "<path d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z'/>"
        },
        {
          name: "Assigned Tickets",
          route: "/tickets/assigned-tickets",
          icon: "<path d='M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4zm2 0c.2-.71 3.3-2 6-2 2.69 0 5.78 1.28 6 2H4z'/>"
        }
      ]
    },
    {
      id: 'raise-request',
      name: 'Raise Request',
      route: '',
      icon: '<path d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"></path>',
      children: [
        {
          name: 'Create Request',
          route: '/create-request',
          icon: '<path d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"></path>'
        },
        {
          name: 'View Requests',
          route: '/requests',
          icon: '<path d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c-.621-.621-.504-1-.504-1V4a3 3 0 0 0-3-3H10a3 3 0 0 0-3-3z"></path>'
        },
        {
          name: 'Assigned Requests',
          route: '/my-requests',
          icon: '<path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4zm2 0c.2-.71 3.3-2 6-2 2.69 0 5.78 1.28 6 2H4z"/>'
        }
      ]
    },
    {
      id: 'knowledge-base',
      name: 'Knowledge Base',
      route: '/knowledge-base',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><path d="M16.5 11h-9v1h9v-1z"></path><circle cx="12" cy="16" r="1"></circle><circle cx="12" cy="7" r="1"></circle>',
      isActive: false
    },
    {
      id: 'reports',
      name: 'Reports',
      route: '/reports',
      icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>',
      isActive: false
    },
    {
      id: 'project-management',
      name: 'Project Management',
      route: '/project-management',
      icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>',
      isActive: false,
      children: [
        {
          name: 'Kanban Board',
          route: '/Kanban',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Gantt Chart',
          route: '/Gantt',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
        {
          name: 'Task Management',
          route: '/TaskManagement',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Project Overview',
          route: '/ProjectOverview',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
        {
          name: 'Sprints',
          route: '/Sprints',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
      ],
    },
    {
      id: 'Pipeline',
      name: 'Pipeline',
      route: '/Pipeline',
      icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>',
      isActive: false,
      children: [
        {
          name: 'Pipeline Overview',
          route: '/PipelineOverview',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Pipeline Management',
          route: '/PipelineManagement',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
      ]
    },
    {
      id: 'Application Metrics',
      name: 'Application Metrics',  
      route: '/ApplicationMetrics',
      icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>',
      isActive: false,
      children: [   
        {
          name: 'Metrics Overview',
          route: '/MetricsOverview',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Metrics Management',
          route: '/MetricsManagement',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
      ]
    },
    {
      id: 'release-management',
      name: 'Release Management',   
      route: '/ReleaseManagement',
      icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>',    
      isActive: false,
      children: [ 
        {
          name: 'Release Overview',
          route: '/ReleaseOverview',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Release Planning',
          route: '/ReleasePlanning',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
        {
          name: 'Release Tracking',
          route: '/ReleaseTracking',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Release Documentation',
          route: '/ReleaseDocumentation',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
        {
          name: 'Execute Release',
          route: '/ExecuteRelease', 
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        }
      ]
    },
    {
      id: 'Profile',
      name: 'Profile Management',  
      route: '/',
      icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>',
      isActive: false,
      children: [   
        {
          name: 'View Profile',
          route: '/profile/view',
          icon: '<path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path><path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"></path>'
        },
        {
          name: 'Edit Profile',
          route: '/profile/edit',
          icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 7h10v10H7z"></path>'
        },
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      route: '/settings',
      icon: '<path d="M19.14,12.94a1,1,0,0,0,.06-.31V11a1,1,0,0,0-.06-.31l1.44-1a1,1,0,0,0,.25-1l-.27-1.55a1,1,0,0,0-.81-.81l-1.55-.27a1,1,0,0,0-1,.25l-1,1.44A1,1,0,0,0,14.06,7H13a1,1,0,0,0-.31.06L11.69,6a1,1,0,0,0-.81-.27L9.33,5A1,1,0,0,0,8.52,5l-.27,1.55a1,1,0,0,0,.25.81l1.44,1A1,1,0,0,0,10.94,9H11a1,1,0,0,0,.31-.06l.38-.26A3.92,3.92,0,0,0,.94,.94L2,.94A3.92,.92A3.92,0,0,0,2.94,2H3a1,1,0,0,0,.31.06l1.44,1a1,1,0,0,0,.25,1l-.27,1.55a1,1,0,0,0,.81.81l1.55.27a1,1,0,0,0,.81-.25l1-1.44A1,1,0,0,0,9.94,7H11a1,1,0,0,0,.31-.06l.38-.26A3.92,3.92,0,0,0,.94,.94L2,.94A3.92,.92A3.92"></path>'
    }
  ];

  // Function to handle active state
  setActive(item: any) {
    this.menuItems.forEach(menuItem => {
      menuItem.isActive = (menuItem.id === item.id);
      if (menuItem.children) {
        menuItem.children.forEach(child => {
          // You can add logic here to handle child active states if needed
        });
      }
    });
  }
}

