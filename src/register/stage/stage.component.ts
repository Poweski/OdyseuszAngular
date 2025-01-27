import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { FormDataService } from '../../shared/data-form.service';

@Component({
  selector: 'app-stage-register', 
  templateUrl: './stage.component.html',
  styleUrls: ['../../styles.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class StageComponent implements OnInit {
  form!: FormGroup;
  stageNumber: number = 1;
  totalStages: number = 5;
  countries: string[] = [];
  organizers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formDataService: FormDataService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.totalStages = +params['totalStages'];
      this.stageNumber = +params['stageNumber'];
      if (this.form) {
        this.resetForm();
      }
    });
    const savedData = this.formDataService.getFormData(this.stageNumber);
    this.form = this.fb.group({
      street: [savedData?.street || '', [Validators.required]],
      city: [savedData?.city || '', [Validators.required]],
      postalCode: [savedData?.postalCode || '', [Validators.required]],
      country: [savedData?.country || '', [Validators.required]],
      organizer: [savedData?.organizer || '', [Validators.required]],
      startDate: [savedData?.startDate || '', [Validators.required, futureDateValidator()]],
      endDate: [savedData?.endDate || '', [Validators.required, futureDateValidator()]],
      },
      { 
        validators: [dateRangeValidator, dateStageValidator(this.formDataService, this.stageNumber) ]
      }
    );

    this.refreshLists();
  }

  private refreshLists(): void {
    this.countries = ['Polska', 'Niemcy', 'Francja', 'USA'];
    this.organizers = ['Organizator 1', 'Organizator 2', 'Organizator 3'];
  }

  private resetForm(): void {
    const savedData = this.formDataService.getFormData(this.stageNumber);
    this.formDataService.resetFormData(this.stageNumber);
    this.form.reset({
      street: savedData?.street || '',
      city: savedData?.city || '',
      postalCode: savedData?.postalCode || '',
      country: savedData?.country || '',
      organizer: savedData?.organizer || '',
      startDate: savedData?.startDate || '',
      endDate: savedData?.endDate || ''
    });
    this.form.setValidators([
      dateRangeValidator, 
      dateStageValidator(this.formDataService, this.stageNumber)
    ]);
    this.form.updateValueAndValidity();
    this.refreshLists();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const formData = this.form.value; 
      this.formDataService.setFormData(this.stageNumber, formData);
      console.log(this.formDataService); 
      if (this.stageNumber < this.totalStages) {
        this.router.navigate([`/stage/${this.totalStages}/${this.stageNumber + 1}`]);
      } else {
        this.router.navigate(['/confirm_register']);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  
  goBack(): void {
    if (this.stageNumber > 1) {
      this.router.navigate([`/stage/${this.totalStages}/${this.stageNumber - 1}`]);
    }
  }
}

function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate < today ? { pastDate: true } : null;
    };
  }

  function dateRangeValidator(form: AbstractControl): ValidationErrors | null {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;
  
    if (!startDate || !endDate) {
      return null;
    }
  
    return new Date(startDate) > new Date(endDate) ? { invalidRange: true } : null;
  }

  function dateStageValidator(formDataService: any, stageNumber: number): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      if (stageNumber < 2) {
        return null;
      }
      const previousStageData = formDataService.getFormData(stageNumber - 1); 
      
      if (!previousStageData) {
        return null; 
      }
  
      const startDate = new Date(form.get('startDate')?.value);
      const endDate = new Date(previousStageData.endDate);
      return startDate < endDate ? {dateError: true} : null;
    };
  }
  