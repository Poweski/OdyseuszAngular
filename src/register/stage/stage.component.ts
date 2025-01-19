import { Component } from '@angular/core';

@Component({
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent {

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
  }

  goBack(): void {
    window.history.back();
  }
}
