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
  standalone: true,
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
    this.loadCMSData();
  }

  /** Load CMS data and prefill the form */
  private loadCMSData() {
    const stateTicket = history.state.prefillTicket;

    this.ticketService.getCMSDataCreateTicket().subscribe({
      next: (config) => {
        this.ticketFormConfig = config.fields;

        const prefillData = this.getPrefillData(config.prefillData, stateTicket);
        this.ticketData = this.cmsMapper.mapApiToForm(this.ticketFormConfig, prefillData);
      },
      error: (err) => {
        this.snackbar.show('Error!', `Failed to load ticket form: ${err}`, 'error', 4000, 'type1');
      }
    });
  }

  /** Prepare prefill data for the form */
  private getPrefillData(cmsPrefill: any, stateTicket?: any) {
    let prefill = { ...cmsPrefill };

    const today = new Date();
    const sevenDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const formattedDate = sevenDaysLater.toISOString().split('T')[0];
    const defaultPriority = 'Medium';

    if (stateTicket) {
      this.snackbar.show(
        'Replicating Ticket...',
        `Loading ticket #${stateTicket.id}`,
        'info',
        4000,
        'type1'
      );

      prefill = {
        ...prefill,
        title: stateTicket.title || '',
        description: stateTicket.description || '',
        status: 'CREATED',
        priority: stateTicket.priority || prefill.priority,
        assignedToGroup: stateTicket.assignedToGroup || '',
        assignedToTeam: stateTicket.assignedToTeam || '',
        assignedToUser: stateTicket.assignedToUser || '',
        tags: stateTicket.tags ? [...stateTicket.tags] : [],
        attachments: stateTicket.attachments ? [...stateTicket.attachments] : [],
        reportedBy: stateTicket.reportedBy || prefill.reportedBy,
        dueDate: stateTicket.dueDate ? new Date(stateTicket.dueDate) : '',
        comments: stateTicket.comments && stateTicket.comments.length
          ? this.extractCommentsText(stateTicket.comments)
          : ['']
      };
    } else {
      // Auto-set due date 7 days from now
      const today = new Date();
      const sevenDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      const formattedDate = sevenDaysLater.toISOString().split('T')[0];

      prefill = {
        ...prefill,
        title: prefill.title || '',
        description: prefill.description || '',
        status: prefill.status || 'CREATED',
        priority: prefill.priority || 'Medium',
        assignedToGroup: prefill.assignedToGroup || '',
        assignedToTeam: prefill.assignedToTeam || '',
        assignedToUser: prefill.assignedToUser || localStorage.getItem('user-email') || '',
        tags: prefill.tags || [],
        attachments: prefill.attachments || [],
        reportedBy: prefill.reportedBy || localStorage.getItem('user-email') || '',
        dueDate: prefill.dueDate
          ? new Date(prefill.dueDate).toISOString().split('T')[0]
          : formattedDate, // auto-set 7 days ahead
        comments: prefill.comments || []
      };

      // Notify user about the auto-set due date
      this.snackbar.show(
        'Info',
        `Due date is automatically set to ${formattedDate} and priority is set to "${defaultPriority}". You can modify them if needed.`,
        'info',
        5000,
        'type1'
      );
    }

    return prefill;
  }


  /** Extract only the comment texts from the ticket */
  private extractCommentsText(ticketComments: any[]): string[] {
    if (!ticketComments || !ticketComments.length) return [''];
    return ticketComments.map(c => c.comment || '');
  }


  /** Submit form */
  onFormSubmit(formValue: any) {
    const payload = this.cmsMapper.mapFormToApi(
      this.ticketFormConfig,
      formValue instanceof FormGroup ? formValue.getRawValue() : formValue
    );

    // Ensure comments is always an array of objects
    payload.comments = Array.isArray(payload.comments)
      ? payload.comments.map((c: any) => ({ commenter: c.commenter || 'agent123@example.com', comment: c.comment }))
      : [{ commenter: localStorage.getItem("user-email"), comment: payload.comments }];

    payload.tags = Array.isArray(payload.tags) ? payload.tags : [payload.tags];
    payload.email = payload.email || 'tanmaysinghx99@gmail.com';

    this.ticketService.generateTicket(payload).subscribe({
      next: (response: any) => {
        const ticketNumber = response?.data?.downstreamResponse?.data?.ticket?.ticketId;
        if (ticketNumber) {
          this.snackbar.show('Ticket Created!', `Your ticket has been successfully created: ${ticketNumber}`, 'success', 5000, 'type1');
          this.navigateToViewTicketsScreen();
        } else {
          this.snackbar.show('Error!', 'Failed to create ticket.', 'error', 4000, 'type1');
        }
      },
      error: (err) => {
        this.snackbar.show('Error!', `Failed to create ticket: ${err}`, 'error', 4000, 'type1');
      }
    });
  }

  /** Handle button actions */
  onButtonClick(event: any) {
    if (event.key === 'cancel') alert('Cancelled, going back...');
    if (event.key === 'save') alert('Saved draft!');
  }

  /** Navigate back after ticket creation */
  private navigateToViewTicketsScreen() {
    setTimeout(() => this.router.navigate(["tickets/view-tickets"]), 7000);
  }
}
