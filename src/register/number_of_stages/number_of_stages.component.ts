import { Component } from '@angular/core';

@Component({
  templateUrl: './number_of_stages.component.html',
  styleUrls: ['./number_of_stages.component.css']
})
export class NumberOfStagesComponent {

  onSubmit(): void {
    console.log("Formularz został zatwierdzony:");
  }

  goBack(): void {
    window.history.back();
  }
}
