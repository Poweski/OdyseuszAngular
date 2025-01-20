import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css'],
    imports: [CommonModule, ReactiveFormsModule]
})
export class StageComponent implements OnInit {
  form!: FormGroup;
  stageNumber: number = 1;
  totalStages: number = 5;
  countries: string[] = ['Polska', 'Niemcy', 'Francja', 'USA'];
  organizers: string[] = ['Organizator 1', 'Organizator 2', 'Organizator 3'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.stageNumber = Number(this.activatedRoute.snapshot.paramMap.get('stage')) || 1;
    this.form = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      organizer: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required], this.endDateBeforeStartDate.bind(this)]
    });
  }

  endDateBeforeStartDate(control: any): ValidationErrors | null {
    const startDate = this.form.get('startDate')?.value;
    const endDate = control.value;

    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return { endDateBeforeStartDate: true };
    }

    return null;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log(this.form.valid);
    console.log(this.form.value); 
    if (this.form.valid) {
      if (this.stageNumber < this.totalStages) {
        this.router.navigate([`/stage/${this.stageNumber + 1}`]);
      } else {
        this.router.navigate(['/summary']);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack(): void {
    if (this.stageNumber > 1) {
      this.router.navigate([`/stage/${this.stageNumber - 1}`]);
    }
  }
}
