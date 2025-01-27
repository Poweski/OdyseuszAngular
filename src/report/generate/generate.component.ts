import { ReportService } from '../../shared/report.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal_data',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class GenerateComponent {
  form!: FormGroup;
  selectedCountries: string[] = [];
  countries: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService, 
    private router: Router
  ) {}

  sendReport(): void {
    const countries = this.reportService.getApiCountries();
    
    const selectedCountryIds = this.selectedCountries.map((name) => {
      const country = countries.find((c) => c.countryName === name);
      return country ? country.countryId : null; 
    }).filter((id) => id !== null);
  
    const reportData = {
      startDate: this.reportService.getStartDate(),
      endDate: this.reportService.getEndDate(),
      filterCountryIds: selectedCountryIds
    };
  
    console.log("Raport do wysłania: ", reportData);
    this.reportService.setReportData(reportData);
  }
  
  ngOnInit(): void {
    this.form = this.fb.group({
        dropdownMenu: ['', [countriesValidator(this.selectedCountries)]],
        startDate: ['', [Validators.required, futureDateValidator()]],
        endDate: ['', [Validators.required, futureDateValidator()]],
      },
      { 
        validators: [dateRangeValidator]
      }
    );
    this.reportService.fetchData();
    this.reportService.getApiCountries();

    this.reportService.fetchCountries().subscribe({
      next: (countries: any[]) => {
        this.countries = countries.map((country) => country.countryName);
      },
      error: (err) => {
        console.error("Błąd pobierania krajów:", err);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  
    const startDateControl = this.form.get('startDate');
    const endDateControl = this.form.get('endDate');
    const startDateValid = startDateControl?.valid;
    const endDateValid = endDateControl?.valid;
    const countriesValid = this.selectedCountries.length > 0;
  
    if (startDateControl && endDateControl) {
      const startDate = new Date(startDateControl.value);
      const endDate = new Date(endDateControl.value);
  
      this.reportService.setStartDate(startDate);
      this.reportService.setEndDate(endDate);
    }
  
    if (startDateValid && endDateValid && countriesValid) {
      this.sendReport();
      this.router.navigate([`/view`]);
    } else {
      if (!startDateValid) {
        this.form.get('startDate')?.markAsTouched();
      }
      if (!endDateValid) {
        this.form.get('endDate')?.markAsTouched();
      }
      if (!countriesValid) {
        this.form.get('dropdownMenu')?.markAsTouched();
      }
    }
  }

  onStartDateChange(event: any): void {
    const date = new Date(event.target.value);
    this.startDate = date;
    this.reportService.setStartDate(date);
  }

  onEndDateChange(event: any): void {
    const date = new Date(event.target.value);
    this.endDate = date;
    this.reportService.setEndDate(date);
  }

  onSelectCountry(event: any): void {
    const selectedCountry = event.target.value;
    const countries = this.reportService.getApiCountries();
    const selectedCountryObj = countries.find((country) => country.countryName === selectedCountry);
    
    if (selectedCountryObj && !this.selectedCountries.includes(selectedCountryObj.countryName)) {
      this.selectedCountries.push(selectedCountryObj.countryName);
      this.reportService.addCountry(selectedCountryObj.countryName);
    }
  }

  removeLastCountry(): void {
    if (this.selectedCountries.length > 0) {
      this.reportService.removeCountry(this.selectedCountries[this.selectedCountries.length-1]);
      this.selectedCountries.pop();
    }
  }

  goBack(): void {
    window.history.back();
  }
}

function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate > today ? { pastDate: true } : null;
    };
  }

function dateRangeValidator(form: AbstractControl): ValidationErrors | null {
  const startDate = form.get('startDate')?.value;
  const endDate = form.get('endDate')?.value;

  if (!startDate || !endDate) {
    return null;
  }

  return new Date(startDate) > new Date(endDate) ? { invalidRange: true } : null;
}

function countriesValidator(selectedCountries: string[]): ValidatorFn {
  return (): ValidationErrors | null => {
    return selectedCountries.length === 0 ? { noCountries: true } : null;
  };
}
