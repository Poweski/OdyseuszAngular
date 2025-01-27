import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private countries: string[] = [];
  private message: string = "";
  private apiCountries: any[] = [];

  constructor(private apiService: ApiService) {}

  fetchData(): void {
    this.apiService.getCountries().subscribe({
      next: (countries) => {
        this.apiCountries = countries;
      },
      error: (err) => {
        console.error('Error while loading countries: ', err);
      }
    });
  }
  
  fetchCountries(): Observable<any[]> {
    return this.apiService.getCountries().pipe(
      tap((countries) => {
        this.apiCountries = countries;
      })
    );
  }

  postMessage(message: string): Observable<any> {
    const countryIds = this.countries
    .map(countryName => {
      const matchingCountry = this.apiCountries.find(
        apiCountry => apiCountry.countryName === countryName
      );
      return matchingCountry?.countryId;
    })
    .filter(Boolean); 
  
    const payload = {
      text: message,
      workerId: "550e8400-e29b-41d4-a716-446655440000",
      countryId: countryIds,
    };
  
    console.log("Sending:", JSON.stringify(payload, null, 2));
    return this.apiService.postMessage(payload);
  }
  
  getApiCountries(): any[] {
    return this.apiCountries;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  addCountry(value: string): void {
    this.countries.push(value);
  }

  removeCountry(value: string): void {
    this.countries = this.countries.filter(item => item !== value);
  }

  getAllCountries(): string[] {
    return [...this.countries];
  }

  clearCountries(): void {
    this.countries = [];
  }
}
