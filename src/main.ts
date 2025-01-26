import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDataComponent } from './register/personal_data/personal_data.component';
import { NumberOfStagesComponent } from './register/number_of_stages/number_of_stages.component';
import { StageComponent } from './register/stage/stage.component';
import { ConfirmRegisterComponent } from './register/confirm_register/confirm_register.component';
import { HomePageComponent } from './homepage/homepage.component';
import { SendComponent } from './message/send/send.component';
import { ConfirmMessageComponent } from './message/confirm_message/confirm_message.component';
import { GenerateComponent } from './report/generate/generate.component';
import { ViewComponent } from './report/view/view.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'personal_data', component: PersonalDataComponent },
  { path: 'number_of_stages', component: NumberOfStagesComponent },
  { path: 'stage/:totalStages/:stageNumber', component: StageComponent },
  { path: 'confirm_register', component: ConfirmRegisterComponent },
  { path: 'send', component: SendComponent },
  { path: 'confirm_message', component: ConfirmMessageComponent },
  { path: 'generate', component: GenerateComponent },
  { path: 'view', component: ViewComponent }
];

const appConfig = {
  imports: [
    FormsModule,
    AppComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
