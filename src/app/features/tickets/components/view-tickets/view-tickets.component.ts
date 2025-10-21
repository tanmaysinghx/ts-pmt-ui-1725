import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class ViewTicketsComponent {
  searchQuery: string = '';
  tableColumns: TableColumn[] = [];
  tickets: any[] = [];

  constructor(private readonly router: Router, private readonly ticketService: TicketService) {}

  ngOnInit() {
    this.getCMSData();
  }

  getCMSData() {
    this.ticketService.getCMSDataViewTickets().subscribe({
      next: (config: any) => {
        // ✅ Corrected key names (columns & prefillData)
        if (config?.columns) {
          this.tableColumns = config.columns.map((col: any) => ({
            key: col.key,
            label: col.label,
            type: col.type || 'text',
            badgeColors: col.badgeColors || undefined
          }));
        }

        // ✅ Fallback demo data if API doesn’t send any
        this.tickets = config?.prefillData?.length
          ? config.prefillData
          : [
              { id: 'TCK-1001', title: 'Email not working', assignedToTeam: 'IT Support', priority: 'High', status: 'Open', createdAt: new Date() },
              { id: 'TCK-1002', title: 'New Software Installation', assignedToTeam: 'IT Support', priority: 'Medium', status: 'In Progress', createdAt: new Date() },
              { id: 'TCK-1003', title: 'VPN Access Issue', assignedToTeam: 'Network Team', priority: 'Critical', status: 'Resolved', createdAt: new Date() }
            ];
      },
      error: (err) => {
        console.error('Failed to load CMS config:', err);
      }
    });
  }

  onRowClick(ticket: any) {
    this.router.navigate(['/ticket-description', ticket.id]);
  }
}