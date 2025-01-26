import { ReportService } from '../../shared/report.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  startDate: Date | null = null;
  endDate: Date | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService, 
    private router: Router
  ) {}

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
    const countryMap: { [key: string]: string } = {
      '1': 'Opcja 1',
      '2': 'Opcja 2',
      '3': 'Opcja 3',
    };

    const countryName = countryMap[selectedCountry] || selectedCountry;

    if (!this.selectedCountries.includes(countryName)) {
      this.selectedCountries.push(countryName);
      this.reportService.addCountry(countryName);
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
