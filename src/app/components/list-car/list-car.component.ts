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

  pageSize = 6; // Số xe mỗi trang (bạn có thể đổi)
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.listCar.length / this.pageSize);
  }

  get pagedCars(): Car[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.listCar.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}