import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/components/dynamic-ui/dynamic-form/dynamic-form.component';
import { CmsMapperService } from '../../../shared/components/dynamic-ui/cms-mapper.service';
import { FieldConfig } from '../../../shared/components/dynamic-ui/field-config.model';

@Component({
  selector: 'app-create-ticket',
  imports: [CommonModule, FormsModule, DynamicFormComponent],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss'
})
export class CreateTicketComponent implements OnInit {
  ticketFormConfig: FieldConfig[] = [];
  ticketData: any = {};
  buttons = [
    { key: 'save', label: 'Save', style: 'secondary', type: 'button' },
    { key: 'submit', label: 'Submit', style: 'primary', type: 'submit' }
  ];

  constructor(private readonly cmsMapper: CmsMapperService) { }

  ngOnInit(): void {
    this.ticketFormConfig = [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter ticket title', required: true },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter detailed description', required: true },
      {
        key: 'status', label: 'Status', type: 'select', options: [
          { value: 'CREATED', label: 'Created' },
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'RESOLVED', label: 'Resolved' },
          { value: 'ON_HOLD', label: 'On Hold' }
        ],
        defaultValue: 'CREATED'
      },
      {
        key: 'priority', label: 'Priority', type: 'select', options: [
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'CRITICAL', label: 'Critical' }
        ],
        defaultValue: 'HIGH'
      },
      { key: 'assignedToGroup', label: 'Assigned Group', type: 'text', placeholder: 'Enter group ID' },
      { key: 'assignedToTeam', label: 'Assigned Team', type: 'text', placeholder: 'Enter team ID' },
      {
        key: 'assignedToUser', label: 'Assigned User', type: 'api-search', placeholder: 'Search user email', apiTrigger: {
          minLength: 3,
          apiUrl: '/users/search',
          mapLabel: 'email',
          mapValue: 'id'
        }
      },
      { key: 'reportedBy', label: 'Reported By', type: 'text', readonly: true },
      { key: 'tags', label: 'Tags', type: 'text', placeholder: 'Comma-separated tags' },
      { key: 'attachments', label: 'Attachments', type: 'file', placeholder: 'Upload files' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'comments', label: 'Comments', type: 'textarea', placeholder: 'Enter comments', readonly: true },
      { key: 'lastUpdatedBy', label: 'Last Updated By', type: 'text', readonly: true }
    ];

    // Example API response (pre-filled data)
    const apiResp = {
      title: '',
      description: '',
      category: 'Bug',
      priority: 'Medium',
      assignedTo: null,
      dueDate: null
    };

    // Map CMS config + API data into usable form model
    this.ticketData = this.cmsMapper.mapApiToForm(this.ticketFormConfig, apiResp);
  }

  onFormSubmit(formValue: any) {
    console.log('Form submitted with data:', formValue);
    const payload = this.cmsMapper.mapFormToApi(this.ticketFormConfig, formValue);
    console.log('Final API Payload:', payload);
  }

  onButtonClick(event: any) {
    console.log('Button clicked:', event);
    if (event.key === 'cancel') {
      // Example: navigate away
      alert('Cancelled, going back...');
    }
    if (event.key === 'save') {
      alert('Saved draft!');
    }
  }
}
