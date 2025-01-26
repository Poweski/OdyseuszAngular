import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private formsData: { [stageNumber: number]: { [key: string]: any } } = {};

  setFormData(stageNumber: number, value: any): void {
    this.formsData[stageNumber] = value;
  }

  getFormData(stageNumber: number): any {
    return this.formsData[stageNumber] || null;
  }

  resetFormData(stageNumber: number): void {
    delete this.formsData[stageNumber];
  }

  getAllFormData(): { [stageNumber: number]: any } {
    return this.formsData;
  }
}
