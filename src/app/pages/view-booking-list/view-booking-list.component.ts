import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../components/footer/footer.component';
import Swal from 'sweetalert2';

import { ProfileService } from '../../services/profile/profile.service';
import { ViewBookingListResponse } from '../../interfaces';
import { BookingService } from '../../services/booking/booking.service';

@Component({
  selector: 'app-view-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NavbarOwnerComponent,
    FooterComponent
  ],
  templateUrl: './view-booking-list.component.html',
  styleUrls: ['./view-booking-list.component.css']
})
export class ViewBookingListComponent implements OnInit {
  bookings: ViewBookingListResponse[] = [];
  userName = '';
  role = '';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private bookingSvc: BookingService,
    private profileSvc: ProfileService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // 1) Lấy thông tin user
    this.profileSvc.getProfile().subscribe({
      next: user => {
        this.userName = user.name;
        this.role = (user as any).role;  // nếu user có property `role`
      },
      error: err => console.error(err)
    });

    // 2) Lấy danh sách booking
    this.bookingSvc.getBookingsForCurrentUser().subscribe({
      next: bs => { this.bookings = bs; console.log(bs); },
      error: err => console.error('Error fetching bookings:', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending deposit': return 'status-pending-deposit';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'pending payment': return 'status-pending-payment';
      default: return '';
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/customer/booking/book', id]);
  }

  // Hàm hiển thị pop-up xác nhận hủy đặt xe
  confirmCancelBooking(bookingId: number) {
    Swal.fire({
      title: 'Xác nhận hủy đặt xe',
      text: 'Bạn có chắc chắn muốn hủy đặt xe không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      customClass: {
        popup: 'my-swal-popup',
        confirmButton: 'my-swal-confirm-btn',
        cancelButton: 'my-swal-cancel-btn'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        this.cancelBooking(bookingId);
      }
    });
  }

  // Hàm thực hiện hủy đặt xe
  private cancelBooking(bookingId: number) {
    this.bookingSvc.cancelBooking(bookingId).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Đã hủy đặt xe thành công', 'success');
        // Cập nhật lại danh sách booking mà không cần reload trang
        this.bookings = this.bookings.filter(booking => booking.idbooking !== bookingId);
      },
      error: err => {
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi hủy đặt xe', 'error');
        console.error(err);
      }
    });
  }
}