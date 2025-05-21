import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-car',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.css']
})
export class SearchCarComponent {
  address: string = '';
  startDateTime: string = '';
  endDateTime: string = '';
  errorMessage = '';

  constructor(private router: Router) { }

  handleSearch(): void {
    // reset thông báo
    this.errorMessage = '';

    // kiểm tra đủ 3 trường
    if (!this.address || !this.startDateTime || !this.endDateTime) {
      this.errorMessage = 'Vui lòng nhập địa điểm, ngày giờ nhận và ngày giờ trả xe.';
      return;
    }

    const params = new URLSearchParams();
    params.set('address', this.address);
    params.set('startDateTime', this.startDateTime);
    params.set('endDateTime', this.endDateTime);
    this.router.navigateByUrl(`/search-car-results?${params.toString()}`);
  }
}