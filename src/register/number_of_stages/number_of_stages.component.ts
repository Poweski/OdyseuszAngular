import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-number_of_stages-register',
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
      this.router.navigate([`/stage/${numberOfStages}/1`]);
    } else {
      this.numberForm.markAllAsTouched();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
