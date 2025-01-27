import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormDataService } from '../../shared/data-form.service';

@Component({
  selector: 'app-personal_data-register',
  templateUrl: './personal_data.component.html',
  styleUrls: ['./personal_data.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;
  countries: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private formDataService: FormDataService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      pesel: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{3}$/)]]
    });

    this.formDataService.fetchCountries().subscribe({
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
    if (this.form.valid) {
      this.formDataService.setPersonalData(this.form.value);
      this.router.navigate(['/number_of_stages']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
