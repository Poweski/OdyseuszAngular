import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private countries: string[] = [];
  private organizers: any[] = [];
  private reportData: any[] = [];
  private apiCountries: any[] = [];
  private startDate: Date | null = null;
  private endDate: Date | null = null;
  private response = new BehaviorSubject<any[]>([]);

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

    this.apiService.getOrganizers().subscribe({
      next: (organizers) => {
        this.organizers = organizers;
      },
      error: (err) => {
        console.error('Error downloading organizers: ', err);
      }
    });
  }

  postReportData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postReport(this.reportData).subscribe({
        next: (response) => {
          this.response = response;
          resolve(response);
        },
        error: (err) => {
          console.error('Error sending report: ', err);
          reject(err);
        }
      });
    });
  }

  getReportResponse() {
    return this.response.asObservable();
  }

  fetchCountries(): Observable<any[]> {
    return this.apiService.getCountries().pipe(
      tap((countries) => {
        this.apiCountries = countries;
      })
    );
  }

  setReportData(reportData: any): void {
    this.reportData = reportData;
  }

  getApiCountries(): any[] {
    return this.apiCountries;
  }

  getOrganizers(): any[] {
    return this.organizers;
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
