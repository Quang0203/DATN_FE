import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Car as CarModel } from '../../../../interfaces';
import { CarService } from '../../../../services/car/car.service';
import { FeedbackService } from '../../../../services/feedback/feedback.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  @Input() car!: CarModel;
  status!: string;
  averageRating: number = 0;

  // Ánh xạ status từ tiếng Anh sang tiếng Việt
  statusMap: { [key: string]: string } = {
    'Available': 'Có sẵn',
    'Booked': 'Đã đặt',
    'Stopped': 'Dừng cho thuê'
  };

  constructor(
    private router: Router,
    private carSvc: CarService,
    private feedbackSvc: FeedbackService
  ) {}

  ngOnInit() {
    this.status = this.car.status;
    // Lấy điểm đánh giá trung bình của xe
    this.feedbackSvc.getAverageRatingByCarId(this.car.idcar).subscribe(rating => {
      this.averageRating = rating;
    });
  }

  stopCar() {
    if (!confirm('Bạn có chắc muốn STOP car không?')) return;
    this.carSvc.stopCar(this.car.idcar).subscribe(res => {
      this.status = res.result.status;
    });
  }

  editCar() {
    this.router.navigate(['/car-owner/mycar/car-detail', this.car.idcar]);
  }

  // Hàm để tạo chuỗi sao dựa trên điểm đánh giá
  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }
}