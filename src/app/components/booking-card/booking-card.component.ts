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

  statusMap: Record<string, string> = {
    'Pending Deposit': 'ĐANG CHỜ CHỦ SỞ HỮU XÁC NHẬN THANH TOÁN',
    'Confirmed': 'ĐÃ ĐƯỢC CHỦ XE XÁC NHẬN THANH TOÁN',
    'Pending Payment': 'ĐANG CHỜ THANH TOÁN NỐT HÓA ĐƠN',
    'In - Progress': 'PHƯƠNG TIỆN ĐANG ĐƯỢC SỬ DỤNG',
    'Cancelled': 'HÓA ĐƠN ĐÃ BỊ HỦY',
    'Completed': 'HOÀN TẤT'
  };

  listMethod: Record<string, string> = {
    'Pending Deposit': 'paidDeposid',
    'Confirmed': 'confirmpickup',
    'In - Progress': 'returncar',
    'Pending Payment': 'returncar'
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
        .post<any>(`http://localhost:8080/createbanktransfer/${id}`, {}, this.headers())
        .toPromise();
      window.location.href = res.result;
    } catch (e) {
      console.error(e);
    }
  }

  handleClick() {
    const method = this.listMethod[this.booking.result.status];
    console.log('Method:', method);
    console.log('Booking:', this.booking);
    if (method === 'paidDeposid' && this.booking.paymentmethod === 'Bank transfer') {
      this.bankTransfer(this.booking.idbooking);
    } else {
      this.bookingMethodPost(method, this.booking.result.idbooking)
        .then(() => window.location.reload());
    }
  }

  handleBack() {
    window.location.href = '/customer';
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
