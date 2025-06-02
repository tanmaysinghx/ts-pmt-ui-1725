// header.component.ts
import { Component, HostListener, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from "../../pipes/safe-html.pipe";

interface DropdownItem {
  label: string;
  icon?: string;
  type: 'link' | 'action';
  link?: string;
  action?: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SafeHtmlPipe
  ],
})
export class NavBarComponent {
  @Input() user?: User;
  @Input() unreadNotifications = 0;

  searchTerm = '';
  isDropdownOpen = false;
  isMobileSearchOpen = false;

  dropdownItems: DropdownItem[] = [
    {
      label: 'Profile',
      icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      type: 'link',
      link: '/profile'
    },
    {
      label: 'Settings',
      icon: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
      type: 'link',
      link: '/settings'
    },
    {
      label: 'Logout',
      icon: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
      type: 'action',
      action: 'logout'
    }
  ];

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit() {
    console.trace('Header rendered');
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.hs-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
      this.searchTerm = '';
      this.isMobileSearchOpen = false;
    }
  }

  toggleMobileSearch(): void {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
    if (this.isMobileSearchOpen) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  openNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  handleDropdownClick(item: DropdownItem): void {
    if (item.action === 'logout') {
      this.logout();
    }
    this.isDropdownOpen = false;
  }

  private logout(): void {
    // Implement logout logic
    this.router.navigate(['/login']);
  }
}