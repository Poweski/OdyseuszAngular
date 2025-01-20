import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal_data',
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
    console.log(this.form.valid);
    console.log(this.form.value); 
    if (this.form.valid) {
      console.warn('Formularz przeszedł.');
      const formData = this.form.value;
            // this.http.post('/api/travel-registration', formData).subscribe({
      //   next: (response) => {
      //     console.log('Dane zostały pomyślnie wysłane:', response);
      //   },
      //   error: (err) => {
      //     console.error('Błąd wysyłania danych:', err);
      //   }
      // });
      this.router.navigate(['/number_of_stages']);
    } else {
      console.warn('Formularz jest nieprawidłowy.');
      this.form.markAllAsTouched();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
