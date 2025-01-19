import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../register/home/home.component';
import { Home2Component } from '../message/home/home.component';
import { Home3Component } from '../report/home/home.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  imports: [CommonModule, Home2Component, HomeComponent, Home3Component]
})
export class HomePageComponent {
  title = 'government-service';
}
