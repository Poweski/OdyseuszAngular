import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRegisterComponent } from '../register/home/home.component';
import { HomeMessageComponent } from '../message/home/home.component';
import { HomeReportComponent } from '../report/home/home.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  imports: [CommonModule, HomeMessageComponent, HomeRegisterComponent, HomeReportComponent]
})
export class HomePageComponent {
  title = 'government-service';
}
