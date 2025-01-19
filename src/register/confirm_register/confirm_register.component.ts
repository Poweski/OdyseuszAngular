import { Component } from '@angular/core';

@Component({
  templateUrl: './confirm_register.component.html',
  styleUrls: ['./confirm_register.component.css']
})
export class ConfirmRegisterComponent {

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
  }

  goBack(): void {
    window.history.back();
  }
}
