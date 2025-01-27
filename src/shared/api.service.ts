import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  postReport(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/raport`, data);
  }

  postMessage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/message`, data);
  }

  postJourney(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/journey`, data);
  }

  getWarningsById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/warnings/${id}`);
  }

  getOrganizers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/organizers`);
  }

  getCountries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/countries`);
  }
}
