import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './personal_data.component.html',
  styleUrls: ['./personal_data.component.css']
})
export class PersonalDataComponent {
  name: { firstName: string; lastName: string; pesel: string } = { firstName: '', lastName: '', pesel: '' };
  address: { street: string; city: string; postalCode: string; country: string } = { street: '', city: '', postalCode: '', country: '' };
  countries: string[] = ['Polska', 'Niemcy', 'Francja', 'Wielka Brytania'];

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
    console.log(this.name, this.address);
  }

  goBack(): void {
    window.history.back();
  }
}
