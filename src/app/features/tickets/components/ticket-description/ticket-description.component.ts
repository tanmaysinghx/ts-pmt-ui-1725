import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-description',
  templateUrl: './ticket-description.component.html',
  styleUrls: ['./ticket-description.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TicketDescriptionComponent implements OnInit {
  // ========== Data Properties ==========
  ticket: any = {};
  ticketHistory: any[] = [];
  teams: any[] = [];
  groups: any[] = [];
  uploadedFiles: File[] = [];

  // ========== User & Input State ==========
  currentUserEmail: string = localStorage.getItem('user-email') || '';
  newComment: string = '';
  newDescription: string = '';

  // ========== UI State ==========
  editingStatus = false;
  editingTeam = false;
  editingGroup = false;
  editingUser = false;
  editingDescription = false;
  showHistory = false;

  // ========== Constants ==========
  statusOptions: string[] = [
    'CREATED',
    'ASSIGNED',
    'OPEN',
    'RETEST',
    'CLOSED',
    'REOPENED',
    'ONHOLD',
    'DUPLICATE',
    'INVALID'
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService
  ) { }

  ngOnInit(): void {
    const ticketId = this.route.snapshot.params['ticketId'];
    if (ticketId) {
      this.loadTicket(ticketId);
      this.loadTeamOptions();
      this.loadGroupOptions();
    }
  }

  // ========== Data Loading ==========

  loadTicket(ticketId: string): void {
    this.ticketService.getTicketById(ticketId).subscribe({
      next: (res) => {
        if (res?.success) {
          const t = res.data?.downstreamResponse?.data?.ticket;
          this.ticket = {
            ...t,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            comments: t.comments || [],
            attachments: t.attachments || []
          };
        }
        console.log("Loaded ticket:", this.ticket);
      },
      error: (err) => console.error('Failed to load ticket:', err)
    });
  }

  loadTeamOptions(): void {
    this.ticketService.getTeamOptions().subscribe({
      next: (res) => (this.teams = res || []),
      error: (err) => console.error('Failed to load teams', err)
    });
  }

  loadGroupOptions(): void {
    this.ticketService.getGroupOptions().subscribe({
      next: (res) => (this.groups = res || []),
      error: (err) => console.error('Failed to load groups', err)
    });
  }

  // ========== Time Calculations ==========

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

  // ========== CSS Class Helpers ==========

  getHeaderClass(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    if (days === 0) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (days <= 3) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (days <= 7) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-green-500 to-green-600';
  }

  getPriorityCardClass(priority: string): string {
    const classes: Record<string, string> = {
      'Critical': 'bg-red-50 border-red-300',
      'High': 'bg-orange-50 border-orange-300',
      'Medium': 'bg-yellow-50 border-yellow-300',
      'Low': 'bg-green-50 border-green-300'
    };
    return classes[priority] || 'bg-gray-50 border-gray-300';
  }

  getPriorityTextClass(priority: string): string {
    const classes: Record<string, string> = {
      'Critical': 'text-red-700',
      'High': 'text-orange-700',
      'Medium': 'text-yellow-700',
      'Low': 'text-green-700'
    };
    return classes[priority] || 'text-gray-700';
  }

  getStatusCardClass(status: string): string {
    const classes: Record<string, string> = {
      'CREATED': 'bg-gray-50 border-gray-300',
      'ASSIGNED': 'bg-blue-50 border-blue-300',
      'OPEN': 'bg-cyan-50 border-cyan-300',
      'RETEST': 'bg-orange-50 border-orange-300',
      'CLOSED': 'bg-green-50 border-green-300',
      'REOPENED': 'bg-yellow-50 border-yellow-300',
      'ONHOLD': 'bg-purple-50 border-purple-300',
      'DUPLICATE': 'bg-pink-50 border-pink-300',
      'INVALID': 'bg-red-50 border-red-300'
    };
    return classes[status] || 'bg-gray-50 border-gray-300';
  }

  getStatusTextClass(status: string): string {
    const classes: Record<string, string> = {
      'CREATED': 'text-gray-700',
      'ASSIGNED': 'text-blue-700',
      'OPEN': 'text-cyan-700',
      'RETEST': 'text-orange-700',
      'CLOSED': 'text-green-700',
      'REOPENED': 'text-yellow-700',
      'ONHOLD': 'text-purple-700',
      'DUPLICATE': 'text-pink-700',
      'INVALID': 'text-red-700'
    };
    return classes[status] || 'text-gray-700';
  }

  getStatusDotClass(status: string): string {
    const classes: Record<string, string> = {
      'CREATED': 'bg-gray-500',
      'ASSIGNED': 'bg-blue-500',
      'OPEN': 'bg-cyan-500',
      'RETEST': 'bg-orange-500',
      'CLOSED': 'bg-green-500',
      'REOPENED': 'bg-yellow-500',
      'ONHOLD': 'bg-purple-500',
      'DUPLICATE': 'bg-pink-500',
      'INVALID': 'bg-red-500'
    };
    return classes[status] || 'bg-gray-500';
  }

  getDueCardClass(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    if (days === 0) return 'bg-red-50 border-red-300';
    if (days <= 3) return 'bg-orange-50 border-orange-300';
    if (days <= 7) return 'bg-yellow-50 border-yellow-300';
    return 'bg-green-50 border-green-300';
  }

  getDueTextClass(ticket: any): string {
    const days = this.getDaysLeft(ticket.dueDate);
    if (days === 0) return 'text-red-700';
    if (days <= 3) return 'text-orange-700';
    if (days <= 7) return 'text-yellow-700';
    return 'text-green-700';
  }

  // ========== Ticket Actions ==========

  updateStatus(newStatus: string): void {
    if (!newStatus) return;

    const changedBy = localStorage.getItem('user-email') || this.currentUserEmail;

    this.ticketService.updateTicketStatus(this.ticket.ticketId, newStatus, changedBy).subscribe({
      next: () => {
        this.ticket.status = newStatus;
        console.log('Status updated successfully to:', newStatus);
      },
      error: (err) => console.error('Failed to update status:', err)
    });
  }

  updateTicket(): void {
    const payload = {
      assignedToUser: this.ticket.assignedToUser,
      assignedToTeam: this.ticket.assignedToTeam,
      assignedToGroup: this.ticket.assignedToGroup
    };

    this.ticketService.updateTicket(this.ticket.ticketId, payload).subscribe({
      next: () => console.log('Ticket reassigned successfully'),
      error: (err) => console.error('Failed to reassign ticket:', err)
    });
  }

  // Primary status actions
  startTicket(): void {
    this.updateStatus('OPEN');
  }

  closeTicket(): void {
    const confirmed = confirm('Are you sure you want to close this ticket?');
    if (confirmed) {
      this.updateStatus('CLOSED');
    }
  }

  reopenTicket(): void {
    this.updateStatus('REOPENED');
  }

  // Secondary status actions
  putOnHold(): void {
    this.updateStatus('ONHOLD');
  }

  markAsRetest(): void {
    this.updateStatus('RETEST');
  }

  markAsDuplicate(): void {
    const confirmed = confirm('Are you sure this is a duplicate ticket?');
    if (confirmed) {
      this.updateStatus('DUPLICATE');
    }
  }

  markAsInvalid(): void {
    const confirmed = confirm('Are you sure this ticket is invalid?');
    if (confirmed) {
      this.updateStatus('INVALID');
    }
  }

  // ========== Description Actions ==========

  addNewDescription(): void {
    if (!this.newDescription.trim()) return;

    const separator = '\n' + '─'.repeat(40) + '\n';
    const timestamp = new Date().toLocaleString();
    this.ticket.description += `${separator}[Updated ${timestamp}]\n${this.newDescription}`;
    this.newDescription = '';
  }

  // ========== Comment Actions ==========

  addComment(): void {
    if (!this.newComment.trim()) return;

    const payload = {
      commenter: this.currentUserEmail,
      comment: this.newComment
    };

    this.ticketService.addComment(this.ticket.ticketId, payload).subscribe({
      next: () => {
        this.ticket.comments.push({
          commenter: this.currentUserEmail,
          comment: this.newComment,
          timestamp: new Date()
        });
        this.newComment = '';
      },
      error: (err) => console.error('Failed to add comment:', err)
    });
  }

  editComment(index: number): void {
    const currentComment = this.ticket.comments[index]?.comment;
    if (!currentComment) return;

    const updated = prompt('Edit your comment:', currentComment);
    if (!updated || updated === currentComment) return;

    this.ticketService.editComment(this.ticket.ticketId, { index, comment: updated }).subscribe({
      next: () => {
        this.ticket.comments[index].comment = updated;
      },
      error: (err) => console.error('Failed to edit comment:', err)
    });
  }

  assignTicket(ticketData: any): void {
    if (!ticketData) return;

    this.ticketService.assignTicket(ticketData.ticketId, ticketData.assignedToUser, localStorage.getItem("user-email")).subscribe({
      next: () => {
        console.log('Ticket assigned successfully');
      },
      error: (err) => console.error('Failed to assign ticket:', err)
    });
  }

  // ========== History Actions ==========

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (this.showHistory && this.ticketHistory.length === 0) {
      this.fetchTicketHistory();
    }
  }

  fetchTicketHistory(): void {
    console.log("Fetching history for ticket id:", this.ticket.ticketId);

    this.ticketService.getTicketHistory(this.ticket.ticketId).subscribe({
      next: (res) => {
        if (res?.success) {
          this.ticketHistory = res?.data?.downstreamResponse?.data?.ticketHistory || [];
        }
      },
      error: (err) => console.error('Failed to fetch ticket history:', err)
    });
  }

  // ========== Attachment Actions ==========

  onFileSelected(event: any): void {
    this.uploadedFiles = Array.from(event.target.files);
  }

  uploadFiles(): void {
    console.log('Uploading files:', this.uploadedFiles);
    // TODO: Implement actual file upload
  }

  openAttachment(att: any): void {
    console.log('Open attachment:', att);
    // TODO: Implement attachment viewer
  }

  downloadAttachment(att: any): void {
    console.log('Download attachment:', att);
    // TODO: Implement file download
  }

  // ========== Attachment Helper Methods ==========

  formatFileSize(bytes: number): string {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  isPDF(fileName: string): boolean {
    return fileName?.toLowerCase().endsWith('.pdf');
  }

  isImage(fileName: string): boolean {
    const ext = fileName?.toLowerCase();
    return ext?.endsWith('.jpg') || ext?.endsWith('.jpeg') || ext?.endsWith('.png') || ext?.endsWith('.gif');
  }

  removeSelectedFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  viewAttachment(att: any): void {
    // Open attachment in new tab or modal
    if (att.fileUrl) {
      window.open(att.fileUrl, '_blank');
    } else {
      console.log('View attachment:', att);
      // TODO: Implement attachment viewer
    }
  }

  deleteAttachment(att: any): void {
    const confirmed = confirm(`Are you sure you want to delete ${att.fileName}?`);
    if (confirmed) {
      // TODO: Implement delete attachment API call
      console.log('Delete attachment:', att);
    }
  }

}