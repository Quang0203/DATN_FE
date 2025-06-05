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
  startDateTimeDisplay: string = '';
  endDateTimeDisplay: string = '';
  isStartDateTimeFocused: boolean = false;
  isEndDateTimeFocused: boolean = false;

  disableRanges: Array<{ start: string; end: string }> = [];
  user: any = null;
  averageRating: number = 0;
  bookings: any[] = [];

  statusMap: { [key: string]: string } = {
    'Available': 'Có sẵn',
    'Booked': 'Đã đặt',
    'Stopped': 'Dừng cho thuê'
  };

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
      next: u => {
        this.user = u;
        this.formData['name'] = u.name;
        this.formData['email'] = u.email;
        this.formData['phoneno'] = u.phoneno;
        this.formData['drivinglicense'] = u.drivinglicense;
        console.log('User profile:', this.user);
        console.log('Form data:', this.formData);
      },
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
      .then(([bookingsRes]) => {
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

  get activeBookings() {
    return this.bookings.filter(booking =>
      booking.status &&
      !['Completed', 'Reported', 'Cancelled'].includes(booking.status)
    );
  }

  onStartDateTimeFocus(): void {
    this.isStartDateTimeFocused = true;
  }

  onStartDateTimeBlur(): void {
    this.isStartDateTimeFocused = false;
    if (this.formData['startdatetime']) {
      this.startDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['startdatetime']);
    }
  }

  onStartDateTimeChange(): void {
    if (this.isDisabled(this.formData['startdatetime'])) {
      this.errorMessage = 'Thời gian này không khả dụng!';
      this.formData['startdatetime'] = '';
      this.startDateTimeDisplay = '';
      return;
    }
    if (this.formData['startdatetime']) {
      this.startDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['startdatetime']);
    }
    if (this.formData['enddatetime'] && this.isEndDateTimeBeforeStartDateTime()) {
      const startDate = new Date(this.formData['startdatetime']);
      startDate.setHours(startDate.getHours() + 1);
      this.formData['enddatetime'] = startDate.toISOString().slice(0, 16);
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['enddatetime']);
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onEndDateTimeFocus(): void {
    this.isEndDateTimeFocused = true;
  }

  onEndDateTimeBlur(): void {
    this.isEndDateTimeFocused = false;
    if (this.formData['enddatetime']) {
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['enddatetime']);
    }
  }

  onEndDateTimeChange(): void {
    if (this.isDisabled(this.formData['enddatetime'])) {
      this.errorMessage = 'Thời gian này không khả dụng!';
      this.formData['enddatetime'] = '';
      this.endDateTimeDisplay = '';
      return;
    }
    if (this.formData['enddatetime']) {
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.formData['enddatetime']);
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onStartDisplayClick(): void {
    const hiddenInput = document.getElementById('startdatetime') as HTMLInputElement;
    if (hiddenInput) {
      if ('showPicker' in hiddenInput) (hiddenInput as any).showPicker();
      else {
        (hiddenInput as HTMLInputElement).focus();
        (hiddenInput as HTMLInputElement).click();
      }
    }
  }

  onEndDisplayClick(): void {
    const hiddenInput = document.getElementById('enddatetime') as HTMLInputElement;
    if (hiddenInput) {
      if ('showPicker' in hiddenInput) (hiddenInput as any).showPicker();
      else {
        (hiddenInput as HTMLInputElement).focus();
        (hiddenInput as HTMLInputElement).click();
      }
    }
  }

  async verifyLicense(): Promise<boolean> {
    if (!this.user?.drivinglicense) {
      this.errorMessage = 'Không tìm thấy ảnh bằng lái xe.';
      return false;
    }

    try {
      const request = {
        requests: [{
          image: { source: { imageUri: this.user.drivinglicense } },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
        }]
      };
      console.log('Request to Google Vision API:', request);

      const resp = await this.http.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.GOOGLE_VISION_API_KEY}`,
        request
      ).toPromise();

      console.log('Response from Google Vision API:', resp);

      const text = (resp as any).responses[0]?.textAnnotations[0]?.description || '';
      const licenseClass = this.extractLicenseClass(text);

      if (!licenseClass) {
        this.errorMessage = 'Không thể trích xuất thông tin hạng bằng lái từ ảnh.';
        return false;
      }
      console.log('License Class:', licenseClass);

      const isValidClass = ['B1', 'B2'].includes(licenseClass);

      if (!isValidClass) {
        this.errorMessage = 'Bằng lái phải thuộc hạng B1 hoặc B2.';
        return false;
      }

      const expirationDate = this.extractExpirationDate(text);
      console.log('Expiration Date:', expirationDate);

      if (!expirationDate) {
        this.errorMessage = 'Không thể trích xuất thông tin ngày hết hạn bằng lái từ ảnh.';
        return false;
      }

      // Chuyển đổi chuỗi ngày thành đối tượng Date bằng native JavaScript
      const [day, month, year] = expirationDate.split('/');
      const expirationDateObj = new Date(Number(year), Number(month) - 1, Number(day));
      console.log('Expiration Date:', expirationDateObj);

      const currentDate = new Date();
      console.log('Current Date:', currentDate);

      const isValidDate = expirationDateObj > currentDate;

      console.log('Is valid class:', isValidClass);
      console.log('Is valid date:', isValidDate);


      if (!isValidDate) {
        this.errorMessage = 'Bằng lái đã hết hạn.';
        return false;
      }

      return true;
    } catch (err) {
      console.error('Lỗi khi xác minh bằng lái:', err);
      this.errorMessage = 'Có lỗi xảy ra khi kiểm tra bằng lái.';
      return false;
    }
  }

  private extractLicenseClass(text: string): string | null {
    const match = text.match(/H[a-z]+\/Class:\s*(\w+)/i);
    return match ? match[1].toUpperCase() : null;
  }

  private extractExpirationDate(text: string): string | null {
    const match = text.match(/Có giá trị đến\s*\/?\s*Expires:\s*(\d{2}\/\d{2}\/\d{4})/i);
    return match ? match[1] : null;
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (!this.formData['startdatetime'] || !this.formData['enddatetime']) {
      this.errorMessage = 'Vui lòng chọn ngày giờ nhận và ngày giờ trả xe.';
      return;
    }

    if (this.isDateTimeInPast(this.formData['startdatetime'])) {
      this.errorMessage = 'Thời gian nhận xe không được chọn trong quá khứ.';
      return;
    }

    if (this.isDateTimeInPast(this.formData['enddatetime'])) {
      this.errorMessage = 'Thời gian trả xe không được chọn trong quá khứ.';
      return;
    }

    if (this.isEndDateTimeBeforeStartDateTime()) {
      this.errorMessage = 'Thời gian trả xe phải lớn hơn thời gian nhận xe.';
      return;
    }

    const startDate = new Date(this.formData['startdatetime']);
    const endDate = new Date(this.formData['enddatetime']);
    const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      this.errorMessage = 'Thời gian thuê xe phải ít nhất 1 giờ.';
      return;
    }

    const isLicenseValid = await this.verifyLicense();
    if (!isLicenseValid) return;

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
    if (rating >= index + 1) return '100%';
    else if (rating > index) return `${(rating - index) * 100}%`;
    else return '0%';
  }
}
