import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {


  profile = {
    name: 'Tanmay Singh',
    email: 'tanmaysinghx@gmail.com',
    accessLevel: 'User',
    group: {
      name: 'BFSI',
      owner: 'xyz@aig.com',
    },
    project: {
      name: 'AIG Claims',
      owner: 'abc@aig.com',
    },
    team: {
      name: 'DMS',
      owner: 'teamlead@aig.com',
    },
    manager: 'manager@aig.com',
    billingCode: 'xav638282',
    passwordChangeDueInDays: 5,
  };


  encodeName(name: string): string {
    return encodeURIComponent(name);
  }
}
