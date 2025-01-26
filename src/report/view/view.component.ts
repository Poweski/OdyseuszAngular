import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../shared/report.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-personal_data',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  imports: [CommonModule]
})
export class ViewComponent implements OnInit {

  selectedCountries: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.selectedCountries = this.reportService.getAllCountries();
    this.startDate = this.reportService.getStartDate();
    this.endDate = this.reportService.getEndDate();
  }
}
