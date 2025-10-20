import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-description',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-description.component.html',
  styleUrl: './ticket-description.component.scss'
})
export class TicketDescriptionComponent {
  ticket: any;

  ngOnInit() {
    // In real use, this would be fetched from a service or passed via route param
    this.ticket = {
      id: 'TCK-9876',
      title: 'VPN access not working after update',
      description: `I recently updated my system and VPN has stopped working. 
I am unable to connect to the client environment.

Steps tried:
1. Restarted machine
2. Reinstalled VPN
3. Checked firewall rules`,
      status: 'Open',
      priority: 'High',
      category: 'Incident',
      createdAt: new Date('2025-07-10T10:00:00'),
      updatedAt: new Date('2025-07-16T14:15:00')
    };
  }
}
