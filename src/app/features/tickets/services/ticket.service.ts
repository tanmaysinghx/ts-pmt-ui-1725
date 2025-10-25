import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private readonly http: HttpClient) { }

  getCMSDataCreateTicket(): Observable<any> {
    let dataUrl: string = environment.cmsUrl + 'assets/data/create-ticket-form-data.json';
    return this.http.get<any>(dataUrl);
  }

  generateTicket(payload: any): Observable<any> {
    const apiUrl: string = environment.apiGatewayService + '/trigger-workflow/WF1674E20001?apiEndpoint=/api/v1/tickets/create-ticket';
    return this.http.post<any>(apiUrl, payload);
  }

  getCMSDataViewTickets(): Observable<any> {
    let dataUrl: string = environment.cmsUrl + 'assets/data/view-ticket-data.json';
    return this.http.get<any>(dataUrl);
  }

  getAllTickets(): Observable<any[]> {
    const apiUrl: string = environment.apiGatewayService + '/trigger-workflow/WF1674E20005?apiEndpoint=/api/v1/tickets/get-all-tickets?status=&assignedToGroup=';
    return this.http.get<any[]>(apiUrl);
  }
}