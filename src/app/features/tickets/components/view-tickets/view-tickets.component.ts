import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicTableComponent, TableColumn } from '../../../../shared/components/dynamic-ui/dynamic-table/dynamic-table.component';
import { TicketService } from '../../services/ticket.service';
import { SnackbarComponent } from '../../../../shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, SnackbarComponent],
  templateUrl: './view-tickets.component.html',
  styleUrl: './view-tickets.component.scss'
})
export class ViewTicketsComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  searchQuery: string = '';
  tableColumns: TableColumn[] = [];
  tickets: any[] = [];
  filters: { [key: string]: string } = {};

  constructor(
    private readonly router: Router,
    private readonly ticketService: TicketService,
    private readonly cdr: ChangeDetectorRef
  ) { }

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
        const tickets = response?.data?.downstreamResponse?.data?.tickets;
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
          this.tickets = [];
        }
      },
      error: (err: any) => {
        console.error('Failed to load tickets:', err);
        this.tickets = [];
      }
    });
  }

  onRowClick(ticket: any) {
    this.snackbar.show(
      'Info',
      `Navigating to ticket #${ticket.id}. Status: ${ticket.status}`,
      'info',
      2000,
      'type1'
    );
    setTimeout(() => this.router.navigate([`/tickets/ticket-description/${ticket.id}`]), 2000);
  }
}