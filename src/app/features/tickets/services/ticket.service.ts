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
}
