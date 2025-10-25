import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-assigned-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigned-tickets.component.html',
  styleUrl: './assigned-tickets.component.scss'
})
export class AssignedTicketsComponent implements OnInit {
  searchQuery: string = '';
  filters = { priority: '', status: '' };
  assignedTickets: any[] = [];
  assignedUserEmail: string = 'charlie@example.com';

  constructor(private readonly router: Router, private readonly http: HttpClient) { }

  ngOnInit() {
    this.loadAssignedTickets();
  }

  loadAssignedTickets() {
    const url = `http://localhost:1674/api/v1/tickets/get-all-tickets?assignedToUser=${this.assignedUserEmail}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        const tickets = res?.data?.tickets || [];
        this.assignedTickets = tickets.map((ticket: any) => ({
          id: ticket.ticketId,
          title: ticket.title,
          category: ticket.category || 'N/A',
          priority: ticket.priority,
          status: ticket.status,
          dueDate: ticket.dueDate ? new Date(ticket.dueDate) : null,
          assignedToTeam: ticket.assignedToTeam || '',
          assignedToGroup: ticket.assignedToGroup || '',
          assignedToUser: ticket.assignedToUser || ''
        }));
      },
      error: (err) => console.error('Failed to fetch assigned tickets:', err)
    });
  }

  filteredAssignedTickets() {
    return this.assignedTickets.filter(ticket => {
      const matchesSearch =
        !this.searchQuery ||
        ticket.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesPriority = !this.filters.priority || ticket.priority === this.filters.priority;
      const matchesStatus = !this.filters.status || ticket.status === this.filters.status;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }

  goToTicket(ticketId: string) {
    this.router.navigate([`/tickets/ticket-description/${ticketId}`]);
  }

  refreshList() {
    this.loadAssignedTickets();
  }

  // --- Time Left Logic ---
  getTimeLeft(dueDate: Date | string | null) {
    if (!dueDate) return { days: 0, hours: 0 };
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const diffMs = due - now;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    return { days: Math.max(days, 0), hours: Math.max(hours, 0) };
  }

  getTimeLeftText(ticket: any): string {
    const { days, hours } = this.getTimeLeft(ticket.dueDate);
    if (days > 0) return `⏰ Due in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `⏰ Due in ${hours} hour${hours > 1 ? 's' : ''}`;
    return '⏰ Overdue!';
  }

  timeLeftTextClass(ticket: any): string {
    const { days, hours } = this.getTimeLeft(ticket.dueDate);
    const totalHours = days * 24 + hours;
    if (totalHours > 168) return 'text-green-600 font-semibold';
    if (totalHours > 72) return 'text-yellow-600 font-semibold';
    if (totalHours >= 24) return 'text-orange-600 font-semibold';
    return 'text-red-600 font-bold';
  }

  timeLeftClass(ticket: any): string {
    const { days, hours } = this.getTimeLeft(ticket.dueDate);
    const totalHours = days * 24 + hours;
    if (totalHours > 168) return 'border-green-400 bg-green-50';
    if (totalHours > 72) return 'border-yellow-400 bg-yellow-50';
    if (totalHours >= 24) return 'border-orange-400 bg-orange-50';
    return 'border-red-400 bg-red-50';
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'text-red-600 font-semibold';
      case 'High': return 'text-orange-600 font-medium';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return '';
    }
  }
}