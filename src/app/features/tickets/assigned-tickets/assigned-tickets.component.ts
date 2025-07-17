import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assigned-tickets',
  imports: [CommonModule, FormsModule],
  templateUrl: './assigned-tickets.component.html',
  styleUrl: './assigned-tickets.component.scss'
})
export class AssignedTicketsComponent {
  searchQuery: string = '';
  filters = {
    priority: '',
    status: ''
  };

  // Mock ticket list
  assignedTickets = [
    {
      id: 'TKT-101',
      title: 'Fix login issue',
      category: 'Authentication',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2025-07-18'
    },
    {
      id: 'TKT-102',
      title: 'Database optimization',
      category: 'Performance',
      priority: 'Critical',
      status: 'Open',
      dueDate: '2025-07-17'
    },
    {
      id: 'TKT-103',
      title: 'Add tooltip on dashboard',
      category: 'UI/UX',
      priority: 'Low',
      status: 'Resolved',
      dueDate: '2025-07-25'
    },
    // Add more as needed
  ];

  constructor(private router: Router) { }

  filteredAssignedTickets() {
    return this.assignedTickets.filter(ticket => {
      const matchesSearch =
        this.searchQuery.trim() === '' ||
        ticket.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesPriority =
        !this.filters.priority || ticket.priority === this.filters.priority;

      const matchesStatus =
        !this.filters.status || ticket.status === this.filters.status;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }

  isUrgent(ticket: any): boolean {
    const now = new Date().getTime();
    const due = new Date(ticket.dueDate).getTime();
    return due - now < 48 * 60 * 60 * 1000; // < 48 hours remaining
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 font-semibold';
      case 'High':
        return 'text-orange-600 font-medium';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return '';
    }
  }

  goToTicket(ticketId: string) {
    this.router.navigate(['/ticket', ticketId]); // update route as per your app
  }

  refreshList() {
    // Later connect to backend or refetch tickets
    console.log('Refreshing ticket list...');
  }
}
