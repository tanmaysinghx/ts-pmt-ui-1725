import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-description',
  templateUrl: './ticket-description.component.html',
  styleUrls: ['./ticket-description.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TicketDescriptionComponent implements OnInit {
  ticket: any = {};
  currentUserEmail: string = 'charlie@example.com';
  newComment: string = '';
  newDescription: string = '';
  editMode: boolean = false;
  showHistory: boolean = false;
  ticketHistory: any[] = [];
  uploadedFiles: File[] = [];
  dummyPdf = '/assets/dummy.pdf';

  // Dropdowns
  statusOptions: string[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  teams: string[] = [];
  groups: string[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    const ticketId = this.route.snapshot.params['ticketId'] || 'TCKT000002';
    this.loadTicket(ticketId);
    this.loadTeamOptions();
    this.loadGroupOptions();
  }

  // --- Load ticket ---
  loadTicket(ticketId: string) {
    const url = `http://localhost:1674/api/v1/tickets/get-ticket/${ticketId}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        const t = res?.data?.ticket;
        this.ticket = {
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          comments: t.comments || [],
          attachments: t.attachments || []
        };
      },
      error: (err) => console.error('Failed to load ticket:', err)
    });
  }

  loadTeamOptions() {
    const url = `http://localhost:1674/api/v1/tickets/team-options`;
    this.http.get<any>(url).subscribe({
      next: (res) => this.teams = res?.data?.teams || [],
      error: (err) => console.error('Failed to load teams', err)
    });
  }

  loadGroupOptions() {
    const url = `http://localhost:1674/api/v1/tickets/group-options`;
    this.http.get<any>(url).subscribe({
      next: (res) => this.groups = res?.data?.groups || [],
      error: (err) => console.error('Failed to load groups', err)
    });
  }

  // --- Time & Priority ---
  getDaysLeft(dueDate: Date | string | null): number {
    if (!dueDate) return 0;
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    return Math.max(Math.ceil((due - now) / (1000 * 60 * 60 * 24)), 0);
  }

  getTimeLeftText(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    return days === 0 ? '⏰ Overdue!' : `⏰ Due in ${days} day${days > 1 ? 's' : ''}`;
  }

  timeLeftTextClass(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    if (days > 7) return 'text-green-600 font-semibold';
    if (days > 3) return 'text-yellow-600 font-semibold';
    if (days >= 1) return 'text-orange-600 font-semibold';
    return 'text-red-600 font-bold';
  }

  timeLeftClass(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    if (days > 7) return 'border-green-400 bg-green-50';
    if (days > 3) return 'border-yellow-400 bg-yellow-50';
    if (days >= 1) return 'border-orange-400 bg-orange-50';
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

  // --- Status & Assignment ---
  updateStatus(newStatus: string) {
    const url = `http://localhost:1674/api/v1/tickets/update-status/${this.ticket.id}`;
    this.http.post(url, { status: newStatus }).subscribe({
      next: () => this.ticket.status = newStatus,
      error: (err) => console.error('Failed to update status:', err)
    });
  }

  reassignTicket() {
    const url = `http://localhost:1674/api/v1/tickets/reassign-user/${this.ticket.id}`;
    this.http.post(url, {
      assignedToUser: this.ticket.assignedToUser,
      assignedToTeam: this.ticket.assignedToTeam,
      assignedToGroup: this.ticket.assignedToGroup
    }).subscribe({
      next: () => console.log('Ticket reassigned successfully'),
      error: (err) => console.error('Failed to reassign ticket:', err)
    });
  }

  // --- Description ---
  addNewDescription() {
    if (!this.newDescription.trim()) return;
    this.ticket.description += `\n__________________________________________\n${this.newDescription}`;
    this.newDescription = '';
  }

  // --- Comments ---
  addComment() {
    if (!this.newComment.trim()) return;
    const url = `http://localhost:1674/api/v1/tickets/add-comment/${this.ticket.id}`;
    this.http.post(url, { commenter: this.currentUserEmail, comment: this.newComment }).subscribe({
      next: () => {
        this.ticket.comments.push({ commenter: this.currentUserEmail, comment: this.newComment });
        this.newComment = '';
      },
      error: err => console.error('Failed to add comment:', err)
    });
  }

  editComment(index: number) {
    const updated = prompt('Edit your comment:', this.ticket.comments[index].comment);
    if (!updated) return;
    const url = `http://localhost:1674/api/v1/tickets/edit-comment/${this.ticket.id}`;
    this.http.post(url, { index, comment: updated }).subscribe({
      next: () => this.ticket.comments[index].comment = updated,
      error: err => console.error('Failed to edit comment:', err)
    });
  }

  // --- Ticket History ---
  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory && this.ticketHistory.length === 0) {
      this.fetchTicketHistory();
    }
  }

  fetchTicketHistory() {
    // const url = `http://localhost:1674/api/v1/tickets/get-ticket-history/${this.ticket.id}`;
    const url = "http://localhost:1674/api/v1/tickets/get-ticket-history/TCKT000002";
    this.http.get<any>(url).subscribe({
      next: res => this.ticketHistory = res?.data?.ticketHistory || [],
      error: err => console.error('Failed to fetch ticket history:', err)
    });
  }

  // --- Attachments ---
  onFileSelected(event: any) {
    this.uploadedFiles = Array.from(event.target.files);
  }

  uploadFiles() {
    console.log('Uploading files:', this.uploadedFiles);
  }

  openAttachment(att: any) { console.log('Open attachment:', att); }
  downloadAttachment(att: any) { console.log('Download attachment:', att); }

  // --- Ticket Lifecycle ---
  startTicket() { this.updateStatus('In Progress'); }
  resolveTicket() { this.updateStatus('Resolved'); }
  closeTicket() { this.updateStatus('Closed'); }
}