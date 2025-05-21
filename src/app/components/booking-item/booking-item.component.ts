import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-booking-item',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.css']
})
export class BookingItemComponent implements OnInit {
  @Input() car!: any;

  formData: { [key: string]: any } = {
    name: '',
    startdatetime: '',
    enddatetime: '',
    email: '',
    phoneno: '',
    drivinglicense: '',
    paymentmethod: ''
  };

  disableRanges: Array<{ start: string; end: string }> = [];
  user: any = null;
  averageRating: number = 0;

  // Ánh xạ status sang tiếng Việt
  statusMap: { [key: string]: string } = {
    'Available': 'Có sẵn',
    'Booked': 'Đã đặt',
    'Stopped': 'Dừng cho thuê'
  };

  // Danh sách phương thức thanh toán với ánh xạ tiếng Anh và tiếng Việt
  paymentMethods: Array<{ value: string; label: string }> = [
    { value: 'My wallet', label: 'Ví tiền' },
    { value: 'Cash', label: 'Tiền mặt' },
    { value: 'Bank transfer', label: 'Chuyển khoản' }
  ];

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Car:', this.car);
    this.loadDisabledRanges();
    this.loadUser();
    this.loadAverageRating();
  }

  private convertToGMT7(dateStr: string): string {
    const date = new Date(dateStr);
    const gmt7 = date.getTime() + 7 * 3600 * 1000;
    return new Date(gmt7).toISOString().slice(0, 16);
  }

  private loadDisabledRanges(): void {
    const url = `http://localhost:8080/getCarBooking/${this.car.idcar}`;
    const token = localStorage.getItem('authToken');

    this.http
      .get<any>(url, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: res => {
          this.disableRanges = res.result.map((r: any) => ({
            start: this.convertToGMT7(r.startdatetime),
            end: this.convertToGMT7(r.enddatetime)
          }));
        },
        error: err => console.error('Load disabled ranges error:', err)
      });
  }

  private loadUser(): void {
    this.profileService.getProfile().subscribe({
      next: u => this.user = u,
      error: err => console.error('Load user error:', err)
    });
  }

  private loadAverageRating(): void {
    const url = `http://localhost:8080/viewFeedbackReport/cars/${this.car.idcar}/averageRatingByIdCar`;
    const token = localStorage.getItem('authToken');

    this.http
      .get<number>(url, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: rating => {
          this.averageRating = rating || 0;
        },
        error: err => {
          console.error('Load average rating error:', err);
          this.averageRating = 0;
        }
      });
  }

  isDisabled(value: string): boolean {
    const selected = new Date(value);
    return this.disableRanges.some(
      range => selected >= new Date(range.start) && selected <= new Date(range.end)
    );
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const { name, value } = input;

    if (this.isDisabled(value)) {
      alert('Ngày này không khả dụng!');
      this.formData[name] = '';
    } else {
      this.formData[name] = value;
    }
  }

  onSubmit(): void {
    const url = `http://localhost:8080/makeABooking/${this.car.idcar}`;
    const token = localStorage.getItem('authToken');
    const payload = { ...this.formData };

    this.http
      .post<any>(url, payload, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: res => this.router.navigate([`/customer/booking/book/${res.result.idbooking}`]),
        error: err => {
          console.error('Booking error:', err);
          alert(err.error.message || 'Error');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/customer']);
  }

  getFilledWidth(index: number, rating: number): string {
    if (rating >= index + 1) {
      return '100%';
    } else if (rating > index) {
      const percentage = (rating - index) * 100;
      return `${percentage}%`;
    } else {
      return '0%';
    }
  }
}