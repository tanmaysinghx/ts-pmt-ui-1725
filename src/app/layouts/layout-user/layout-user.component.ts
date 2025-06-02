import { Component } from '@angular/core';
import { LeftMenuComponent } from "../../shared/components/left-menu/left-menu.component";
import { BreadcrumpComponent } from "../../shared/components/breadcrump/breadcrump.component";
import { RouterModule } from '@angular/router';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-user',
  imports: [RouterModule, LeftMenuComponent, BreadcrumpComponent, NavBarComponent, CommonModule],
  templateUrl: './layout-user.component.html',
  styleUrl: './layout-user.component.scss'
})
export class LayoutUserComponent {
  sidebarOpen = true;
  notificationCount = 3;
  currentUser: User | undefined;

  ngOnInit() {
      this.currentUser = {
        id: "1",
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
      }
    }

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    }

    handleSearch(term: string) {
      console.log('Searching for:', term);
    }

    handleLogout() {
      console.log('Logging out...');
    }

  }
