import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-ticket',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss'
})
export class CreateTicketComponent {
setTicketField(_t60: string,$event: any) {
throw new Error('Method not implemented.');
}
getTicketField(_t60: string): any {
throw new Error('Method not implemented.');
}
  ticket = {
    title: '',
    description: '',
    category: '',
    subcategory: '',
    priority: '',
    impact: '',
    urgency: '',
    status: 'New',
    assignedTo: '',
    dueDate: '',
    location: '',
    attachments: [] as File[]
  };

  categories: Record<string, string[]> = {
    'Software': ['Installation', 'Bug', 'Access Request'],
    'Hardware': ['Printer', 'Laptop', 'Peripheral'],
    'Network': ['VPN', 'WiFi', 'Firewall']
  };

  get subcategories() {
    return this.categories[this.ticket.category] || [];
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.categories);
  }

  handleFileChange(event: any) {
    this.ticket.attachments = Array.from(event.target.files);
  }

  submitForm() {
    console.log('Ticket submitted:', this.ticket);
  }
}
