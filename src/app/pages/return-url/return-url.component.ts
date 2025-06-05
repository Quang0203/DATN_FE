import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking/booking.service';
import { finalize } from 'rxjs/operators'; // Để xử lý trạng thái loading

@Component({
  selector: 'app-return-url',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-url.component.html',
  styleUrls: ['./return-url.component.css']
})
export class ReturnUrlComponent implements OnInit {
  vnpAmount!: string | null;
  idbooking!: string | null;
  status!: string | null; // vnp_ResponseCode từ URL
  booking: any = null;

  isLoading: boolean = true; // Trạng thái loading cho cuộc gọi API /returnurl
  apiCallError: string | null = null; // Lỗi từ cuộc gọi API /returnurl

  isCompleting: boolean = false; // MỚI: Trạng thái loading cho hành động hoàn thành booking
  completionError: string | null = null; // MỚI: Lỗi từ cuộc gọi API completeBooking

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingSvc: BookingService
  ) { }

  ngOnInit(): void {
    this.vnpAmount = this.route.snapshot.queryParamMap.get('vnp_Amount');
    this.idbooking = this.route.snapshot.queryParamMap.get('vnp_OrderInfo');
    this.status = this.route.snapshot.queryParamMap.get('vnp_ResponseCode');

    if (this.status && this.idbooking) {
      this.isLoading = true;
      this.apiCallError = null;

      this.bookingSvc.handlePaymentReturnUrl({ vnp_ResponseCode: this.status, vnp_OrderInfo: this.idbooking }).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (res: any) => {
          if (res.result) {
            this.fetchBookingDetails(); // Chỉ fetch chi tiết nếu xác nhận thanh toán thành công
          } else {
            this.apiCallError = `Xác nhận thanh toán thất bại từ hệ thống. Mã phản hồi: ${this.status}.`;
            if (res.message) {
              this.apiCallError += ` Chi tiết: ${res.message}`;
            }
          }
        },
        error: (err) => {
          this.apiCallError = `Lỗi kết nối đến máy chủ xác nhận thanh toán. Vui lòng thử lại sau.`;
          console.error('Lỗi khi gọi API /returnurl:', err);
        }
      });
    } else {
      this.isLoading = false;
      this.apiCallError = 'Thiếu thông tin thanh toán cần thiết trong URL.';
    }
  }

  private fetchBookingDetails(): void {
    if (this.idbooking) {
      this.bookingSvc.getBookingById(+this.idbooking).subscribe({
        next: data => {
          this.booking = data;
          console.log('Thông tin đặt chỗ:', this.booking);
        },
        error: err => {
          console.error('Không thể lấy thông tin đặt chỗ:', err);
          this.apiCallError = 'Không thể tải thông tin chi tiết đặt chỗ.';
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/customer']);
  }

  // Hàm onConfirm không còn dùng đến trong luồng hiện tại của bạn
  /* onConfirm(): void { ... } */

  /**
   * MỚI: Gọi API để hoàn thành booking, sau đó mới điều hướng.
   */
  onComplete(): void {
    if (!this.idbooking) {
      this.completionError = 'Không có ID đặt chỗ để hoàn thành.';
      return;
    }

    this.isCompleting = true; // Bắt đầu loading cho hành động hoàn thành
    this.completionError = null; // Xóa lỗi cũ

    if (this.booking.status === "Pending Deposit") {
      this.bookingSvc.handlePaymentReturnUrl({ vnp_ResponseCode: this.status!, vnp_OrderInfo: this.idbooking! }).pipe(
        finalize(() => this.isCompleting = false) // Luôn tắt loading khi hoàn thành hoặc lỗi
      ).subscribe({
        next: (res: any) => {
          if (res.result) {
            console.log('Trạng thái đặt chỗ đã được cập nhật thành hoàn thành ở backend.');
            // Chỉ điều hướng khi API backend báo thành công
            this.router.navigate([`/customer/booking/book/${this.idbooking}`]);
          } else {
            this.completionError = `Không thể hoàn thành đặt chỗ: ${res.message || 'Lỗi không xác định từ hệ thống.'}`;
            console.error('Không thể hoàn thành đặt chỗ ở backend:', res);
          }
        },
        error: (err) => {
          // Lỗi kết nối hoặc lỗi server khi gọi API completeBooking
          this.completionError = `Lỗi kết nối khi hoàn thành đặt chỗ: ${err.message || 'Vui lòng thử lại.'}`;
          console.error('Lỗi khi gọi API completeBooking:', err);
        }
      });
    }
    else if (this.booking.status === "In - Progress") {
      this.bookingSvc.handleCompletePaymentReturnUrl(this.status!, this.idbooking!).pipe(
        finalize(() => this.isCompleting = false) // Luôn tắt loading khi hoàn thành hoặc lỗi
      ).subscribe({
        next: (res: any) => {
          if (res.result) {
            console.log('Trạng thái đặt chỗ đã được cập nhật thành hoàn thành ở backend.');
            // Chỉ điều hướng khi API backend báo thành công
            this.router.navigate([`/customer/booking/book/${this.idbooking}`]);
          } else {
            this.completionError = `Không thể hoàn thành đặt chỗ: ${res.message || 'Lỗi không xác định từ hệ thống.'}`;
            console.error('Không thể hoàn thành đặt chỗ ở backend:', res);
          }
        },
        error: (err) => {
          // Lỗi kết nối hoặc lỗi server khi gọi API completeBooking
          this.completionError = `Lỗi kết nối khi hoàn thành đặt chỗ: ${err.message || 'Vui lòng thử lại.'}`;
          console.error('Lỗi khi gọi API completeBooking:', err);
        }
      });
    }
    else if (this.booking.status === "Pending Payment") {
      this.bookingSvc.confirmPayment(this.booking.idbooking)
      .subscribe({
        next: (res: any) => {
          if (res.result) {
            console.log('Trạng thái đặt chỗ đã được cập nhật thành hoàn thành ở backend.');
            // Chỉ điều hướng khi API backend báo thành công
            this.router.navigate([`/car-owner/mybooking`]);
          } else {
            this.completionError = `Không thể hoàn thành đặt chỗ: ${res.message || 'Lỗi không xác định từ hệ thống.'}`;
            console.error('Không thể hoàn thành đặt chỗ ở backend:', res);
          }
        },
        error: (err) => {
          // Lỗi kết nối hoặc lỗi server khi gọi API completeBooking
          this.completionError = `Lỗi kết nối khi hoàn thành đặt chỗ: ${err.message || 'Vui lòng thử lại.'}`;
          console.error('Lỗi khi gọi API completeBooking:', err);
        }
      });
    }
  }
}