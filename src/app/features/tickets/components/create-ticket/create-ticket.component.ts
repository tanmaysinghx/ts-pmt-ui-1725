import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-ui/dynamic-form/dynamic-form.component';
import { CmsMapperService } from '../../../../shared/components/dynamic-ui/cms-mapper.service';
import { FieldConfig } from '../../../../shared/components/dynamic-ui/field-config.model';
import { SnackbarComponent } from '../../../../shared/components/snackbar/snackbar.component';
import { TicketService } from '../../services/ticket.service';

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
    private readonly http: HttpClient,
    private readonly ticketService: TicketService,
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
        console.error('Failed to load CMS data from service:', err);
        this.showErrorSnackbar();
      }
    });
  }

  onFormSubmit(formValue: any) {
    console.log('Form submitted with data:', formValue);
    const payload = this.cmsMapper.mapFormToApi(this.ticketFormConfig, formValue);
    console.log('Final API Payload:', payload);
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

  showCustomSnackbar() {
    this.snackbar.show('Ticket Created!', 'Your ticket has been successfully created.', 'success', 5000, 'type1');
  }

  showErrorSnackbar() {
    this.snackbar.show('Error!', 'Failed to create ticket.', 'error', 4000, 'type1');
  }

  showSuccess() {
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
