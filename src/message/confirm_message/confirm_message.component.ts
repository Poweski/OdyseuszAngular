import { Component } from '@angular/core';

@Component({
  templateUrl: './confirm_message.component.html',
  styleUrls: ['./confirm_message.component.css']
})
export class ConfirmMessageComponent {

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
  }

  goBack(): void {
    window.history.back();
  }
}
