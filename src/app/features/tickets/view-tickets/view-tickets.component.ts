import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-tickets',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-tickets.component.html',
  styleUrl: './view-tickets.component.scss'
})
export class ViewTicketsComponent {
  searchQuery: string = '';

  filters = {
    category: '',
    priority: '',
    status: ''
  };

  tickets = [
    {
      id: 'TCK-1001',
      title: 'Email not working',
      category: 'Incident',
      priority: 'High',
      status: 'Open',
      createdAt: new Date()
    },
    {
      id: 'TCK-1002',
      title: 'New Software Installation',
      category: 'Installation',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: new Date()
    },
    {
      id: 'TCK-1003',
      title: 'VPN Access Issue',
      category: 'Access Issue',
      priority: 'Critical',
      status: 'Resolved',
      createdAt: new Date()
    },
    {
      id: 'TCK-1003',
      title: 'VPN Access Issue',
      category: 'Access Issue',
      priority: 'Critical',
      status: 'Resolved',
      createdAt: new Date()
    },
    {
      id: 'TCK-1003',
      title: 'VPN Access Issue',
      category: 'Access Issue',
      priority: 'Critical',
      status: 'Resolved',
      createdAt: new Date()
    },
    {
      id: 'TCK-1003',
      title: 'VPN Access Issue',
      category: 'Access Issue',
      priority: 'Critical',
      status: 'Resolved',
      createdAt: new Date()
    },
    {
      id: 'TCK-1003',
      title: 'VPN Access Issue',
      category: 'Access Issue',
      priority: 'Critical',
      status: 'Resolved',
      createdAt: new Date()
    }

  ];

  constructor(private router: Router) {}

  filteredTickets() {
    return this.tickets.filter(ticket => {
      const matchesQuery =
        !this.searchQuery ||
        ticket.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = !this.filters.category || ticket.category === this.filters.category;
      const matchesPriority = !this.filters.priority || ticket.priority === this.filters.priority;
      const matchesStatus = !this.filters.status || ticket.status === this.filters.status;

      return matchesQuery && matchesCategory && matchesPriority && matchesStatus;
    });
  }

  goToTicket(id: string) {
    this.router.navigate(['/ticket-description', id]);
  }
}
