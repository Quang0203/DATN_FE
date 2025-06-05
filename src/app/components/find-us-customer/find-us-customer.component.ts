import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarData {
  address: string;
  car_count: number;
  car_count_rounded: string;
  image: string;
}

@Component({
  selector: 'app-find-us-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-us-customer.component.html',
  styleUrls: ['./find-us-customer.component.css']
})
export class FindUsCustomerComponent {
  @Input() carData: CarData[] = [];
  // @Input() carData: [string, number][] = [];

}
