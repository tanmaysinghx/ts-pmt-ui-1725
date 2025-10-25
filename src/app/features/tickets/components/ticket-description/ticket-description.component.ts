import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-description',
  templateUrl: './ticket-description.component.html',
  styleUrl: './ticket-description.component.scss',
  imports: [CommonModule, FormsModule]
})
export class TicketDescriptionComponent implements OnInit {
reassignUser() {
throw new Error('Method not implemented.');
}
  ticket: any = {};
  currentUserEmail: string = 'charlie@example.com';
  newComment: string = '';
  editMode: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const ticketId = this.route.snapshot.params['ticketId'];
    this.loadTicket(ticketId);
  }

  loadTicket(ticketId: string) {
    const url = `http://localhost:1674/api/v1/tickets/get-ticket/${ticketId}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        const t = res?.data?.ticket;
        this.ticket = {
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          comments: t.comments || [],
          attachments: t.attachments || [],
          tags: t.tags || []
        };
      },
      error: (err) => console.error('Failed to load ticket:', err)
    });
  }

  // --- Time left / priority helpers ---
  getDaysLeft(dueDate: Date | string | null): number {
    if (!dueDate) return 0;
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const diffMs = due - now;
    return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
  }

  getTimeLeftText(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    if (days === 0) return '⏰ Overdue!';
    return `⏰ Due in ${days} day${days > 1 ? 's' : ''}`;
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

  // --- Ticket Actions ---
  startTicket() { this.updateStatus('In Progress'); }
  resolveTicket() { this.updateStatus('Resolved'); }
  closeTicket() { this.updateStatus('Closed'); }

  updateStatus(newStatus: string) {
    const url = `http://localhost:1674/api/v1/tickets/update-status/${this.ticket.id}`;
    this.http.post(url, { status: newStatus }).subscribe({
      next: () => this.ticket.status = newStatus,
      error: (err) => console.error('Failed to update status:', err)
    });
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
      error: (err) => console.error('Failed to add comment:', err)
    });
  }

  editComment(index: number) {
    const updated = prompt('Edit your comment:', this.ticket.comments[index].comment);
    if (updated !== null) {
      const url = `http://localhost:1674/api/v1/tickets/update-comment/${this.ticket.id}`;
      this.http.post(url, { index, comment: updated }).subscribe({
        next: () => this.ticket.comments[index].comment = updated,
        error: (err) => console.error('Failed to update comment:', err)
      });
    }
  }

  // --- Edit Ticket ---
  toggleEdit() { this.editMode = !this.editMode; }

  saveChanges() {
    const url = `http://localhost:1674/api/v1/tickets/update-ticket/${this.ticket.id}`;
    this.http.post(url, this.ticket).subscribe({
      next: () => { this.editMode = false; console.log('Ticket updated'); },
      error: (err) => console.error('Failed to save ticket changes:', err)
    });
  }

  // --- Attachments (placeholders) ---
  openAttachment(att: any) {
    alert('Opening attachment: ' + (att.name || att));
  }

  downloadAttachment(att: any) {
    alert('Downloading attachment: ' + (att.name || att));
  }
}