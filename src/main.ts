import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './register/home/home.component';
import { PersonalDataComponent } from './register/personal_data/personal_data.component';
import { NumberOfStagesComponent } from './register/number_of_stages/number_of_stages.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', children: [
      { path: 'personal_data', component: PersonalDataComponent },
      { path: 'number_of_stages', component: NumberOfStagesComponent }
    ]}
];

const appConfig = {
  imports: [
    FormsModule,
    AppComponent,
    HomeComponent,
    PersonalDataComponent,
    NumberOfStagesComponent
  ],
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
