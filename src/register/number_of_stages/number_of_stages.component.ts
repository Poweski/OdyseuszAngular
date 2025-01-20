import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-number-of-stages',
  templateUrl: './number_of_stages.component.html',
  styleUrls: ['./number_of_stages.component.css'],
    imports: [ReactiveFormsModule]
})
export class NumberOfStagesComponent implements OnInit {
  numberForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.numberForm = this.fb.group({
      numberOfStages: ['1', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.numberForm.valid) {
      const numberOfStages = this.numberForm.value.numberOfStages;
      console.log(numberOfStages);
      this.router.navigate(['/stage/1']);
    } else {
      console.warn('Formularz jest nieprawidłowy!');
      this.numberForm.markAllAsTouched();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
