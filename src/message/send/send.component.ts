import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-form',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SendComponent {
  selectedCountries: string[] = []; 
  message: string = '';
  form: FormGroup;

  constructor(    
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      countries: ['', Validators.required],
      message: ['', Validators.required]
    });
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
    console.log('in submit');
    console.log('Formularz został zatwierdzony:');
    this.router.navigate([`/confirm_message`]);
  }

  removeLastCountry(): void {
    if (this.selectedCountries.length > 0) {
      this.selectedCountries.pop();
      this.messageService.removeCountry(this.selectedCountries[this.selectedCountries.length - 1]);
    }
  }

  goBack(): void {
    window.history.back();
  }
}
