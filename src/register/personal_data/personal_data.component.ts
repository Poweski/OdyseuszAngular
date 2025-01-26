import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal_data-register',
  templateUrl: './personal_data.component.html',
  styleUrls: ['./personal_data.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;
  countries: string[] = ['Polska', 'Niemcy', 'Francja', 'USA'];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      pesel: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      this.router.navigate(['/number_of_stages']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
