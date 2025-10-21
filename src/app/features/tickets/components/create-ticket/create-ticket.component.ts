import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-ui/dynamic-form/dynamic-form.component';
import { CmsMapperService } from '../../../../shared/components/dynamic-ui/cms-mapper.service';
import { FieldConfig } from '../../../../shared/components/dynamic-ui/field-config.model';
import { SnackbarComponent } from '../../../../shared/components/snackbar/snackbar.component';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  imports: [CommonModule, FormsModule, DynamicFormComponent, SnackbarComponent],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss'
})
export class CreateTicketComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  ticketFormConfig: FieldConfig[] = [];
  ticketData: any = {};
  buttons = [
    { key: 'save', label: 'Save', style: 'secondary', type: 'button' },
    { key: 'submit', label: 'Submit', style: 'primary', type: 'submit' }
  ];

  constructor(
    private readonly cmsMapper: CmsMapperService,
    private readonly ticketService: TicketService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.getCMSData();
  }

  getCMSData() {
    this.ticketService.getCMSDataCreateTicket().subscribe({
      next: (config) => {
        this.ticketFormConfig = config.fields;
        this.ticketData = this.cmsMapper.mapApiToForm(config.fields, config.prefillData);
      },
      error: (err) => {
        this.snackbar.show('Error!', `Failed to create ticket: ${err}`, 'error', 4000, 'type1');
      }
    });
  }

  onFormSubmit(formValue: any) {
    const payload = this.cmsMapper.mapFormToApi(
      this.ticketFormConfig,
      formValue instanceof FormGroup ? formValue.getRawValue() : formValue
    );

    payload.comments = [
      {
        commenter: 'agent123@example.com',
        comment: payload.comments
      }
    ];

    payload.tags = [payload.tags];

    payload.email = payload.email || 'tanmaysinghx99@gmail.com';
    this.ticketService.generateTicket(payload).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        const ticketNumber = response?.data?.downstreamResponse?.data?.ticket?.ticketId;
        if (ticketNumber) {
          this.snackbar.show('Ticket Created!', `Your ticket has been successfully created: ${ticketNumber}`, 'success', 5000, 'type1');
          this.navigateToViewTicketsScreen()
        } else {
          this.snackbar.show('Error!', 'Failed to create ticket.', 'error', 4000, 'type1');
        }
      },
      error: (err) => {
        this.snackbar.show('Error!', `Failed to create ticket: ${err}`, 'error', 4000, 'type1');
      }
    });
  }

  onButtonClick(event: any) {
    console.log('Button clicked:', event);
    if (event.key === 'cancel') {
      alert('Cancelled, going back...');
    }
    if (event.key === 'save') {
      alert('Saved draft!');
    }
  }

  navigateToViewTicketsScreen() {
    setTimeout(() =>{
      this.router.navigate(["tickets/view-tickets"]);
    }, 7000);
  }

  showCustomSnackbar() {
    this.snackbar.show('Ticket Created!', 'Your ticket has been successfully created.', 'success', 5000, 'type1');
  }

  showErrorList() {
    this.snackbar.show(
      'Validation errors occurred:',
      '',
      'error',
      7000,
      'type2',
      [
        "Username is already in use",
        "Email field can't be empty",
        "Please enter a valid phone number"
      ]
    );
  }
}
