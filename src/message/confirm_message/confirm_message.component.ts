import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/message.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-view-report',
  templateUrl: './confirm_message.component.html',
  styleUrls: ['./confirm_message.component.css'],
  imports: [CommonModule]
})
export class ConfirmMessageComponent implements OnInit {

  selectedCountries: string[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.selectedCountries = this.messageService.getAllCountries();
  }
}
