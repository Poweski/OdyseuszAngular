import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent {
  selectedCountries: string[] = []; 
  message: string = '';

  constructor(    
    private messageService: MessageService,
    private router: Router
  ) {}

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

  sendMessage(): void {
    console.log("Wiadomość została wysłana.");
  }

  onSubmit(event: Event): void {
    console.log('in submit');
    event.preventDefault();

    if (this.selectedCountries.length === 0) {
      alert('Musisz wybrać przynajmniej jeden kraj!');
      return;
    }

    if (this.message.trim() === '') {
      alert('Pole tekstowe nie może być puste!');
      return;
    }

    console.log('Formularz został zatwierdzony:');
    this.router.navigate([`/confirm_message`]);
  }

  goBack(): void {
    window.history.back();
  }
}
