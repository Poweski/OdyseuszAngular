import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-form',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SendComponent {
  selectedCountries: string[] = [];
  countries: string[] = [];
  message: string = "";
  form!: FormGroup;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countries: ['', Validators.required],
      message: ['', [Validators.required, this.messageLengthValidator]]
    });
    this.messageService.fetchData();

    this.messageService.fetchCountries().subscribe({
      next: (countries: any[]) => {
        this.countries = countries.map((country) => country.countryName);
      },
      error: (err) => {
        console.error("Błąd pobierania krajów:", err);
      }
    });
  }
  
  onSelectCountry(event: any): void {
    const selectedCountry = event.target.value;
    const countries = this.messageService.getApiCountries();
    const selectedCountryObj = countries.find((country) => country.countryName === selectedCountry);
    
    if (selectedCountryObj && !this.selectedCountries.includes(selectedCountryObj.countryName)) {
      this.selectedCountries.push(selectedCountryObj.countryName);
      this.messageService.addCountry(selectedCountryObj.countryName);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.message = this.form.get('message')?.value || '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.messageService.setMessage(this.message);
    this.messageService.postMessage(this.message).subscribe({
      next: (response) => {
        console.log('Wiadomość została wysłana pomyślnie:', response);
        this.router.navigate(['/confirm_message']);
      },
      error: (err) => {
        console.error('Błąd przy wysyłaniu wiadomości:', err);
      }
    });
  }

  removeLastCountry(): void {
    if (this.selectedCountries.length > 0) {
      const removedCountry = this.selectedCountries.pop();
      if (removedCountry) {
        this.messageService.removeCountry(removedCountry);
      }
    }
  }

  goBack(): void {
    window.history.back();
  }

  private messageLengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const maxLength = 500;
    if (control.value && control.value.length > maxLength) {
      return { maxLengthExceeded: true };
    }
    return null;
  }
}
