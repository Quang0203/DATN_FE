import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarData { address: string; car_count: number; car_count_rounded: string; image: string; }

@Component({
  selector: 'app-find-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-us.component.html',
  styleUrls: ['./find-us.component.css']
})
export class FindUsComponent {
  @Input() carData: CarData[] = [];
}
