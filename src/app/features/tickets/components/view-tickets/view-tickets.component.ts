import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicTableComponent, TableColumn } from '../../../../shared/components/dynamic-ui/dynamic-table/dynamic-table.component';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent],
  templateUrl: './view-tickets.component.html',
  styleUrl: './view-tickets.component.scss'
})
export class ViewTicketsComponent implements OnInit {
  searchQuery: string = '';
  tableColumns: TableColumn[] = [];
  tickets: any[] = [];
  filters: { [key: string]: string } = {};

  constructor(private readonly router: Router, private readonly ticketService: TicketService, private readonly cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCMSData();
  }

  getCMSData() {
    this.ticketService.getCMSDataViewTickets().subscribe({
      next: (config: any) => {
        if (config?.columns) {
          this.tableColumns = config.columns.map((col: any) => ({
            key: col.key,
            label: col.label,
            type: col.type || 'text',
            badgeColors: col.badgeColors || undefined
          }));
          const tempFilters: { [key: string]: string } = {};
          config.columns.forEach((col: any) => {
            tempFilters[col.key] = col.defaultFilter ?? '';
          });
          this.filters = { ...tempFilters };
          this.cdr.detectChanges();
        }

        this.getAPIData();
      },
      error: (err) => console.error('Failed to load CMS config:', err)
    });
  }


  getAPIData() {
    this.ticketService.getAllTickets().subscribe({
      next: (response: any) => {
        console.log("Raw API Response:", response);
        const tickets = response?.data?.downstreamResponse?.data?.tickets;

        console.log("Data", tickets);

        if (Array.isArray(tickets)) {
          this.tickets = tickets.map(ticket => ({
            id: ticket.ticketId,
            title: ticket.title,
            assignedToTeam: ticket.assignedToTeam,
            priority: ticket.priority,
            status: ticket.status,
            reportedBy: ticket.reportedBy,
            createdAt: new Date(ticket.createdAt),
            updatedAt: new Date(ticket.updatedAt),
            tags: ticket.tags.join(', '),
            attachmentsCount: ticket.attachments?.length || 0,
            dueDate: new Date(ticket.dueDate),
            assignedToUser: ticket.assignedToUser
          }));
        } else {
          console.warn('Tickets array not found in response:', response);
          this.tickets = [];
        }

        console.log('Mapped Tickets:', this.tickets);
      },
      error: (err: any) => {
        console.error('Failed to load tickets:', err);
        this.tickets = [];
      }
    });
  }

  onRowClick(ticket: any) {
    this.router.navigate(['/ticket-description', ticket.id]);
  }
}