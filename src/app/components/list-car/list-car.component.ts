import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Car {
  idcar: number;
  name: string;
  images: string;
}

@Component({
  selector: 'app-list-car',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.css']
})
export class ListCarComponent {
  @Input() listCar: Car[] = [];
}