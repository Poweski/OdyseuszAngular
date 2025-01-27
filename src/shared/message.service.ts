import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

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

  postMessage(selectedCountries: string[], message: string): Observable<any> {
    const payload = {
      message: message,
      countries: selectedCountries,
    };

    return this.apiService.postMessage(payload);
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
