import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people-say-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-say-customer.component.html',
  styleUrls: ['./people-say-customer.component.css']
})
export class PeopleSayCustomerComponent {
  @Input() feedbackData: any[] = [];
}
