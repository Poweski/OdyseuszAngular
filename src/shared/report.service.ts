import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private countries: string[] = [];
  private startDate: Date | null = null;
  private endDate: Date | null = null;

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

  setStartDate(date: Date): void {
    this.startDate = date;
  }

  setEndDate(date: Date): void {
    this.endDate = date;
  }

  getStartDate(): Date | null {
    return this.startDate;
  }

  getEndDate(): Date | null {
    return this.endDate;
  }

  clearDates(): void {
    this.startDate = null;
    this.endDate = null;
  }

  modifyDates(startDate: Date | null, endDate: Date | null): void {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
