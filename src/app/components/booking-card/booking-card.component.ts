import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RatingModelComponent } from '../rating-model/rating-model.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, RatingModelComponent],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css']
})
export class BookingCardComponent {
  @Input() booking!: any;
  @Input() car!: any;

  showModal = false;

  // Map status to Vietnamese messages
  paymentMethodMap: Record<string, string> = {
    'Bank transfer': 'Chuyển khoản ngân hàng',
    'Cash': 'Tiền mặt',
    'My wallet': 'Ví tiền'
  };

  statusMap: Record<string, string> = {
    'Initialized': 'Đã đặt xe thành công',
    'Pending Deposit': 'Đang chờ chủ sở hữu xác nhận thanh toán tiền đặt cọc',
    'Confirmed': 'Đã được chủ xe xác nhận thanh toán tiền đặt cọc',
    'Pending Payment': 'Đang chờ thanh toán nốt hóa đơn',
    'In - Progress': 'Phương tiện đang được sử dụng',
    'Cancelled': 'Đơn đặt xe đã bị hủy',
    'Completed': 'Hoàn thành trả xe thành công',
    'Reported': 'Đã đánh giá xe',
  };

  listMethod: Record<string, string> = {
    'Initialized': 'paidDeposid',
    'Pending Deposit': 'confirmed',
    'Confirmed': 'confirmpickup',
    'In - Progress': 'returncar',
    'Pending Payment': 'report'
  };

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      })
    };
  }

  async bookingMethodPost(method: string, id: number) {
    try {
      // if (method === 'initialized') alert('Xác nhận thanh toán hóa đơn');
      if (method === 'paidDeposid') alert('Xác nhận thanh toán hóa đơn');
      if (method === 'confirmpickup') alert('Xác nhận lấy xe');
      if (method === 'returncar') alert('Xác nhận trả xe');

      const res = await this.http
        .post<any>(`http://localhost:8080/${method}/${id}`, {}, this.headers())
        .toPromise();
      return res;
    } catch (e: any) {
      alert(e.error?.message || 'Error');
    }
  }

  async bankTransfer(id: number) {
    try {
      const res = await this.http
        .post<any>(`http://localhost:8080/banktransfer/createbanktransfer/${id}`, {}, this.headers())
        .toPromise();
      window.location.href = res.result;
    } catch (e) {
      console.error(e);
    }
  }

  handleClick() {
    const method = this.listMethod[this.booking.result.status];
    console.log('Method:', method);
    console.log('Booking:', this.booking.result.paymentmethod);
    if (this.booking.result.paymentmethod === 'Bank transfer' && (method === 'paidDeposid' || method === 'returncar')) {
      this.bankTransfer(this.booking.result.idbooking);
    } else {
      this.bookingMethodPost(method, this.booking.result.idbooking)
        .then(() => window.location.reload());
    }
  }

  handleBack() {
    window.location.href = '/view-booking-list';
  }

  confirmCancel() {
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
        this.handleCancel();
      }
    });
  }

  handleCancel() {
    this.bookingMethodPost('cancelbooking', this.booking.result.idbooking)
      .then(() => window.location.reload());
  }

  handleReport() {
    this.showModal = true;
  }
  handleClose() {
    this.showModal = false;
  }
}
