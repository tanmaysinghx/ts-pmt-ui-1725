import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { SnackbarComponent } from '../../../../shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-search-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, SnackbarComponent],
  templateUrl: './search-tickets.component.html',
  styleUrl: './search-tickets.component.scss'
})
export class SearchTicketsComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  searchQuery: string = '';
  searched: boolean = false;
  recentSearches: string[] = [];
  results: any[] = [];
  allTickets: any[] = [];

  replicatingTicketId: string | null = null;

  constructor(
    private readonly ticketService: TicketService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.loadAllTickets();
  }

  /** Load all tickets from API */
  loadAllTickets() {
    this.ticketService.getAllTickets().subscribe({
      next: (response: any) => {
        const tickets = response?.data?.downstreamResponse?.data?.tickets || [];
        this.allTickets = tickets.map((ticket: any) => ({
          ...ticket,
          id: ticket.ticketId,
          tags: ticket.tags?.join(', ') || '',
          attachmentsCount: ticket.attachments?.length || 0,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt),
          dueDate: ticket.dueDate ? new Date(ticket.dueDate) : null
        }));
        this.results = [...this.allTickets];
      },
      error: (err) => console.error('Failed to fetch tickets:', err)
    });
  }

  performSearch() {
    this.searched = true;
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.results = [...this.allTickets];
      return;
    }

    this.addToRecentSearches(query);
    this.results = this.allTickets.filter(ticket =>
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query)
    );
  }

  addToRecentSearches(query: string) {
    if (!this.recentSearches.includes(query)) {
      this.recentSearches.unshift(query);
      if (this.recentSearches.length > 5) this.recentSearches.pop();
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.performSearch();
  }

  /** Navigate to ticket with snackbar info */
  goToTicket(ticket: any) {
    console.log("ddmdm", ticket);
    this.snackbar.show(
      'Info',
      `Navigating to ticket #${ticket}.`,
      'info',
      2000,
      'type1'
    );

    setTimeout(() => {
      this.router.navigate(['/tickets/ticket-description', ticket]);
    }, 2000);
  }

  /** Replicate ticket with snackbar notification */
  replicateTicket(ticket: any) {
    this.replicatingTicketId = ticket.id;

    this.snackbar.show(
      'Info',
      `Replicating ticket #${ticket.id}. You will be redirected to create ticket form.`,
      'info',
      2000,
      'type1'
    );

    setTimeout(() => {
      this.replicatingTicketId = null;
      this.router.navigate(['/tickets/create-ticket'], {
        state: { prefillTicket: ticket }
      });
    }, 2000);
  }
}