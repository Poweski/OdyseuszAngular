import { Component } from '@angular/core';

@Component({
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent {

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
  }

  goBack(): void {
    window.history.back();
  }
}
