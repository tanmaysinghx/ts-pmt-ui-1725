import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-tickets',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-tickets.component.html',
  styleUrl: './search-tickets.component.scss'
})
export class SearchTicketsComponent {
  searchQuery: string = '';
  searched: boolean = false;

  recentSearches: string[] = [];

  results = [
    {
      id: 'TCK-1234',
      title: 'VPN not working',
      category: 'Incident',
      priority: 'High',
      status: 'Open',
      createdAt: new Date()
    },
    {
      id: 'TCK-5678',
      title: 'Email setup request',
      category: 'Installation',
      priority: 'Medium',
      status: 'Resolved',
      createdAt: new Date()
    }
  ];

  allTickets = [...this.results]; // this would be replaced by actual API call

  performSearch() {
    this.searched = true;
    if (this.searchQuery.trim()) {
      this.addToRecentSearches(this.searchQuery.trim());

      this.results = this.allTickets.filter(ticket =>
        ticket.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.results = [];
    }
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

  goToTicket(ticketId: string) {
    // Use Angular router navigation
    console.log(`Navigate to ticket detail page for: ${ticketId}`);
  }

  replicateTicket(ticket: any) {
    // Navigate to create-ticket component with ticket prefilled
    console.log('Replicating ticket:', ticket);
    // Pass via query params or shared state
  }
}
