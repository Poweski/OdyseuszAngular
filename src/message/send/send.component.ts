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
  countries: string = "";
  message: string = "";
  form: FormGroup;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      countries: ['', Validators.required],
      message: ['', [Validators.required, this.messageLengthValidator]]
    });
  }

  ngOnInit(): void {
    // Fetch available countries when the component loads
    this.messageService.fetchData();
  }

  onSelectCountry(event: any): void {
    const selectedCountry = event.target.value;
    const countryMap: { [key: string]: string } = {
      '1': 'Opcja 1',
      '2': 'Opcja 2',
      '3': 'Opcja 3',
    };

    if (selectedCountry) {
      const countryName = countryMap[selectedCountry] || selectedCountry;
      if (!this.selectedCountries.includes(countryName)) {
        this.selectedCountries.push(countryName);
        this.messageService.addCountry(countryName);
      }
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Wyślij dane formularza przez MessageService
    // this.messageService.postMessage(this.selectedCountries, this.message).subscribe({
    //   next: (response) => {
    //     console.log('Wiadomość została wysłana pomyślnie:', response);
    //     this.router.navigate(['/confirm_message']);
    //   },
    //   error: (err) => {
    //     console.error('Błąd przy wysyłaniu wiadomości:', err);
    //     // Pokaż komunikat o błędzie użytkownikowi, jeśli API nie odpowiada.
    //   }
    // });
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
