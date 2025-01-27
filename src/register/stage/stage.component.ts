import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { FormDataService } from '../../shared/data-form.service';

@Component({
  selector: 'app-stage-register',
  templateUrl: './stage.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class StageComponent implements OnInit {
  form!: FormGroup;
  stageNumber: number = 1;
  totalStages: number = 5;
  countries: { countryName: string, countryID: string }[] = [];
  organizers: string[] = [];
  selectedCountryId: string | null = null;
  currentWarning: string = '';

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
    });

    this.formDataService.fetchCountries().subscribe({
      next: (countries: any[]) => {
        this.countries = countries.map((country) => ({
          countryName: country.countryName,
          countryID: country.countryId
        }));
        console.log(this.countries);
      },
      error: (err) => {
        console.error("Błąd pobierania krajów:", err);
      }
    });

    this.formDataService.fetchOrganizers().subscribe({
      next: (organizers: any[]) => {
        this.organizers = organizers.map((organizer) => organizer.organizerName);
      },
      error: (err) => {
        console.error("Błąd pobierania organizatorów:", err);
      }
    });

    this.form.get('country')?.valueChanges.subscribe((countryName: string) => {
      const selectedCountry = this.countries.find(c => c.countryName === countryName);
      console.log("selectedCountry: " + JSON.stringify(selectedCountry, null, 2) );
      if (selectedCountry) {
        this.selectedCountryId = selectedCountry.countryID;
        this.fetchWarning(this.selectedCountryId);
      }
    });

    this.refreshLists();
  }

  private refreshLists(): void {
    this.formDataService.fetchCountries().subscribe({
      next: (countries: any[]) => {
        this.countries = countries.map((country) => ({
          countryName: country.countryName,
          countryID: country.countryId
        }));
      },
      error: (err) => {
        console.error("Błąd pobierania krajów:", err);
      }
    });
    
    this.formDataService.fetchOrganizers().subscribe({
      next: (organizers: any[]) => {
        this.organizers = organizers.map((organizer) => organizer.organizerName);
      },
      error: (err) => {
        console.error("Błąd pobierania organizatorów:", err);
      }
    });
  }

  private resetForm(): void {
    this.currentWarning = '';
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

  fetchWarning(countryID: string): void {
    this.formDataService.getWarning(countryID).subscribe({
      next: (warning: string) => {
        this.currentWarning = warning;
        console.log("Ostrzeżenie dla kraju:", warning);
      },
      error: (err) => {
        console.error("Błąd pobierania ostrzeżenia:", err);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const formData = this.form.value; 
      this.formDataService.setFormData(this.stageNumber, formData);
      if (this.stageNumber < this.totalStages) {
        this.router.navigate([`/stage/${this.totalStages}/${this.stageNumber + 1}`]);
      } else {
        this.formDataService.postJourneyData().subscribe({
          next: () => {
            this.router.navigate(['/confirm_register']);
          },
          error: (err) => {
            console.error('Błąd przy wysyłaniu danych:', err);
          }
        });
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
    return startDate < endDate ? { dateError: true } : null;
  };
}
