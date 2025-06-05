import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { BookingService } from '../../services/booking/booking.service';

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

  loading = true;
  errorMessage = '';
  minDateTime: string = '';

  // Hiển thị placeholder cho datetime inputs
  startDateTimeDisplay: string = '';
  endDateTimeDisplay: string = '';
  isStartDateTimeFocused: boolean = false;
  isEndDateTimeFocused: boolean = false;

  disableRanges: Array<{ start: string; end: string }> = [];
  user: any = null;
  averageRating: number = 0;
  bookings: any[] = []; // Danh sách booking của xe

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
  private GOOGLE_VISION_API_KEY = 'YOUR_GOOGLE_VISION_API_KEY'; // Replace with your actual API key
  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private bookingSvc: BookingService,
    private router: Router
  ) {
    // Thiết lập thời gian tối thiểu là thời điểm hiện tại
    this.setMinDateTime();
  }

  ngOnInit(): void {
    console.log('Car:', this.car);
    this.loadDisabledRanges();
    this.loadUser();
    this.loadAverageRating();
    this.loadBookingCar();
  }

  private setMinDateTime(): void {
    const now = new Date();
    // Định dạng datetime-local cần format: YYYY-MM-DDTHH:mm
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  private isDateTimeInPast(dateTimeString: string): boolean {
    if (!dateTimeString) return false;
    const selectedDate = new Date(dateTimeString);
    const now = new Date();
    return selectedDate < now;
  }

  private isEndDateTimeBeforeStartDateTime(): boolean {
    if (!this.formData['startdatetime'] || !this.formData['enddatetime']) return false;
    const startDate = new Date(this.formData['startdatetime']);
    const endDate = new Date(this.formData['enddatetime']);
    return endDate <= startDate;
  }

  private formatDateTimeForDisplay(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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

  private loadBookingCar() {
    if (!this.car.idcar) return;
    this.loading = true;

    Promise.all([
      this.bookingSvc.getBookingsByCarId(this.car.idcar).toPromise()
    ])
      .then(([ bookingsRes]) => {
        this.bookings = (bookingsRes as any)?.result || [];
      })
      .catch(error => {
        console.error('Error fetching car details, rating, or bookings', error);
        this.bookings = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }

  isDisabled(value: string): boolean {
    const selected = new Date(value);
    return this.disableRanges.some(
      range => selected >= new Date(range.start) && selected <= new Date(range.end)
    );
  }

  // Lọc booking đang active (chưa hoàn thành hoặc bị hủy)
  get activeBookings() {
    return this.bookings.filter(booking => 
      booking.status && 
      !['Completed', 'Reported', 'Cancelled'].includes(booking.status)
    );
  }

  // Xử lý khi focus vào start datetime
  onStartDateTimeFocus(): void {
    this.isStartDateTimeFocused = true;
  }

  // Xử lý khi blur khỏi start datetime
  onStartDateTimeBlur(): void {
    this.isStartDateTimeFocused = false;
    if (this.formData['startdatetime']) {
      this.startDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['startdatetime']);
    }
  }

  // Phương thức để xử lý khi thay đổi thời gian bắt đầu
  onStartDateTimeChange(): void {
    if (this.formData['startdatetime']) {
      this.startDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['startdatetime']);
    }

    // Nếu thời gian kết thúc đã được chọn và nhỏ hơn hoặc bằng thời gian bắt đầu mới
    if (this.formData['enddatetime'] && this.isEndDateTimeBeforeStartDateTime()) {
      // Tự động đặt thời gian kết thúc là 1 giờ sau thời gian bắt đầu
      const startDate = new Date(this.formData['startdatetime']);
      startDate.setHours(startDate.getHours() + 1);
      this.formData['enddatetime'] = startDate.toISOString().slice(0, 16);
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['enddatetime']);
    }
    
    // Xóa thông báo lỗi khi người dùng thay đổi
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  // Xử lý khi focus vào end datetime
  onEndDateTimeFocus(): void {
    this.isEndDateTimeFocused = true;
  }

  // Xử lý khi blur khỏi end datetime
  onEndDateTimeBlur(): void {
    this.isEndDateTimeFocused = false;
    if (this.formData['enddatetime']) {
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['enddatetime']);
    }
  }

  // Phương thức để xử lý khi thay đổi thời gian kết thúc
  onEndDateTimeChange(): void {
    if (this.formData['enddatetime']) {
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['enddatetime']);
    }

    // Xóa thông báo lỗi khi người dùng thay đổi
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  // Xử lý khi click vào display input
  onStartDisplayClick(): void {
    const hiddenInput = document.getElementById('startdatetime') as HTMLInputElement;
    if (hiddenInput) {
      if ('showPicker' in hiddenInput) {
        // Hiện picker nếu trình duyệt hỗ trợ
        (hiddenInput as any).showPicker();
      } else {
        (hiddenInput as HTMLInputElement).focus();
        (hiddenInput as HTMLInputElement).click();
      }
    }
  }

  onEndDisplayClick(): void {
    const hiddenInput = document.getElementById('enddatetime') as HTMLInputElement;
    if (hiddenInput) {
      if ('showPicker' in hiddenInput) {
        (hiddenInput as any).showPicker();
      } else {
        (hiddenInput as HTMLInputElement).focus();
        (hiddenInput as HTMLInputElement).click();
      }
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const { name, value } = input;

    if (this.isDisabled(value)) {
      this.errorMessage = 'Ngày này không khả dụng!';
      this.formData[name] = '';
    } else {
      this.formData[name] = value;
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    // Reset thông báo
    this.errorMessage = '';

    // Kiểm tra đủ các trường bắt buộc
    if (!this.formData['startdatetime'] || !this.formData['enddatetime']) {
      this.errorMessage = 'Vui lòng chọn ngày giờ nhận và ngày giờ trả xe.';
      return;
    }

    // Kiểm tra ngày giờ bắt đầu không được trong quá khứ
    if (this.isDateTimeInPast(this.formData['startdatetime'])) {
      this.errorMessage = 'Thời gian nhận xe không được chọn trong quá khứ. Vui lòng chọn thời gian hiện tại hoặc tương lai.';
      return;
    }

    // Kiểm tra ngày giờ kết thúc không được trong quá khứ
    if (this.isDateTimeInPast(this.formData['enddatetime'])) {
      this.errorMessage = 'Thời gian trả xe không được chọn trong quá khứ. Vui lòng chọn thời gian hiện tại hoặc tương lai.';
      return;
    }

    // Kiểm tra thời gian kết thúc phải lớn hơn thời gian bắt đầu
    if (this.isEndDateTimeBeforeStartDateTime()) {
      this.errorMessage = 'Thời gian trả xe phải lớn hơn thời gian nhận xe. Vui lòng chọn lại.';
      return;
    }

    // Kiểm tra thời gian thuê tối thiểu (ít nhất 1 giờ)
    const startDate = new Date(this.formData['startdatetime']);
    const endDate = new Date(this.formData['enddatetime']);
    const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      this.errorMessage = 'Thời gian thuê xe phải ít nhất 1 giờ.';
      return;
    }

    const url = `http://localhost:8080/makeABooking/${this.car.idcar}`;
    const token = localStorage.getItem('authToken');
    const payload = { ...this.formData };

    this.http
      .post<any>(url, payload, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: res => this.router.navigate([`/customer/booking/book/${res.result.idbooking}`]),
        error: err => {
          console.error('Booking error:', err);
          this.errorMessage = err.error.message || 'Có lỗi xảy ra khi đặt xe';
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/customer']);
  }

  // Format datetime cho hiển thị
  formatDateTime(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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