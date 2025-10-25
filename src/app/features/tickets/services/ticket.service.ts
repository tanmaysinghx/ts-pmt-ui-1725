import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private readonly http: HttpClient) { }

  // ========== CMS Data ==========

  getCMSDataCreateTicket(): Observable<any> {
    const dataUrl = environment.cmsUrl + 'assets/data/create-ticket-form-data.json';
    return this.http.get<any>(dataUrl);
  }

  getCMSDataViewTickets(): Observable<any> {
    const dataUrl = environment.cmsUrl + 'assets/data/view-ticket-data.json';
    return this.http.get<any>(dataUrl);
  }

  getTeamOptions(): Observable<any> {
    const url = `${environment.cmsUrl}assets/data/assignedToTeam.json`;
    return this.http.get<any>(url);
  }

  getGroupOptions(): Observable<any> {
    const url = `${environment.cmsUrl}assets/data/assignedToGroup.json`;
    return this.http.get<any>(url);
  }

  // ========== Ticket CRUD ==========

  generateTicket(payload: any): Observable<any> {
    const apiUrl = environment.apiGatewayService + '/trigger-workflow/WF1674E20001?apiEndpoint=/api/v1/tickets/create-ticket';
    return this.http.post<any>(apiUrl, payload);
  }

  getAllTickets(): Observable<any[]> {
    const apiUrl = environment.apiGatewayService + '/trigger-workflow/WF1674E20005?apiEndpoint=/api/v1/tickets/get-all-tickets?status=&assignedToGroup=';
    return this.http.get<any[]>(apiUrl);
  }

  getTicketById(ticketId: string): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20004?apiEndpoint=/api/v1/tickets/get-ticket/${ticketId}`;
    return this.http.get<any>(apiUrl);
  }

  updateTicket(ticketId: string, payload: any): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20008?apiEndpoint=/api/v1/tickets/modify-ticket/${ticketId}`;
    return this.http.post<any>(apiUrl, payload);
  }

  updateTicketStatus(ticketId: any, status: any, changedBy: any): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20003?apiEndpoint=/api/v1/tickets/update-status/${ticketId}/${status}?changedBy=${changedBy}`;
    return this.http.post<any>(apiUrl, { status });
  }

  addComment(ticketId: string, payload: any): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20007?apiEndpoint=/api/v1/tickets/add-comments/${ticketId}`;
    return this.http.post<any>(apiUrl, payload);
  }

  editComment(ticketId: string, payload: { index: number; comment: string }): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20008?apiEndpoint=/api/v1/tickets/edit-comment/${ticketId}`;
    return this.http.post<any>(apiUrl, payload);
  }

  getTicketHistory(ticketId: string): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20006?apiEndpoint=/api/v1/tickets/get-ticket-history/${ticketId}`;
    return this.http.get<any>(apiUrl);
  }

  assignTicket(ticketId: any, assignedToUser: string, changedBy: any): Observable<any> {
    const apiUrl = environment.apiGatewayService + `/trigger-workflow/WF1674E20002?apiEndpoint=/api/v1/tickets/assign-ticket/${ticketId}/${assignedToUser}/?changedBy=${changedBy}`;
    return this.http.post<any>(apiUrl, {});
  }
}
