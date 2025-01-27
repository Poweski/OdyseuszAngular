import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private formsData: { [stageNumber: number]: { [key: string]: any } } = {};
  private countries: string[] = [];
  private apiCountries: any[] = [];
  private personalData: any;
  private organizers: any;

  constructor(private apiService: ApiService) {}

  setFormData(stageNumber: number, value: any): void {
    this.formsData[stageNumber] = value;
  }

  getFormData(stageNumber: number): any {
    return this.formsData[stageNumber] || null;
  }

  resetFormData(stageNumber: number): void {
    delete this.formsData[stageNumber];
  }

  getAllFormData(): { [stageNumber: number]: any } {
    return this.formsData;
  }

  setPersonalData(personalData: any): void {
    this.personalData = personalData;
  }

  getWarning(id: string): Observable<string> {
    return this.apiService.getWarningsById(id).pipe(
      map((warnings: any[]) => warnings[0]?.text),
      catchError((err) => {
        console.error('Błąd podczas ładowania ostrzeżenia: ', err);
        return of('Nie udało się pobrać ostrzeżenia');
      })
    );
  }
  
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

  fetchOrganizers(): Observable<any[]> {
    return this.apiService.getOrganizers().pipe(
      tap((organizers) => {
        this.organizers = organizers;
      })
    );
  }

  postJourneyData(): Observable<any> {
    const client = {
      name: this.personalData.firstName,
      surname: this.personalData.lastName,
      email: this.personalData.email,
      phone: this.personalData.phone,
      address: {
        city: this.personalData.city,
        address: this.personalData.street,
        postalCode: this.personalData.postalCode,
        countryId: this.getCountryId(this.personalData.country),
      },
      pesel: this.personalData.pesel
    };
  
    const stages = Object.keys(this.formsData).map((stageNumber) => {
      const stageData = this.formsData[parseInt(stageNumber)];
      
      return {
        organizerId: this.getOrganizerId(stageData['organizer']),
        arrivalDate: stageData['startDate'],
        departureDate: stageData['endDate'],
        address: {
          city: stageData['city'],
          address: stageData['street'],
          postalCode: stageData['postalCode'],
          houseNumber: stageData['houseNumber'],
          countryId: this.getCountryId(stageData['country']),
        }
      };
    });
  
    const journeyData = {
      client,
      stage: stages
    };
  
    return this.apiService.postJourney(journeyData);
  }
  
  private getCountryId(countryName: string): string | undefined {
    const country = this.apiCountries.find(
      apiCountry => apiCountry.countryName === countryName
    );
    return country?.countryId;
  }
  
  private getOrganizerId(organizerName: string): string | undefined {
    const organizer = this.organizers.find(
      (org: any) => org.organizerName === organizerName
    );
    return organizer?.organizerId;
  }
  
}
