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
      id: 'products',
      name: 'Products',
      icon: '<path d="M20 7h-4V5l-2-2H6L4 5v2H0v14h20V7zM6 5h6v2H6V5zm12 14H2V9h16v10z"></path>',
      children: [
        {
          name: 'All Products', route: '/products',
          icon: ''
        },
        {
          name: 'Categories', route: '/products/categories',
          icon: ''
        }
      ]
    },
    {
      name: 'Customers',
      route: '/customers',
      icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
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

