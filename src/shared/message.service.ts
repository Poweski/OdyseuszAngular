import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private countries: string[] = [];

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
