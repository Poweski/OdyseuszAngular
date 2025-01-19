import { Component } from '@angular/core';

@Component({
  selector: 'app-personal_data',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent {

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
  }

  goBack(): void {
    window.history.back();
  }
}
