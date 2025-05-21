import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../../../services/booking/booking.service';
import { CarService } from '../../../../services/car/car.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  @Input() booking!: any;
  car: any;
  status!: string;

  // Ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
  statusMap: { [key: string]: string } = {
    'Pending Deposit': 'Chờ thanh toán đặt cọc',
    'Confirmed': 'Đã xác nhận',
    'In - Progress': 'Đang thực hiện',
    'Completed': 'Hoàn thành',
    'Cancelled': 'Đã hủy',
    'Pending Payment': 'Chờ thanh toán'
  };

  constructor(
    private bookingSvc: BookingService,
    private carSvc: CarService
  ) {}

  ngOnInit(): void {
    this.status = this.booking.status;
    this.carSvc.getCarDetails(this.booking.carIdcar).subscribe(res => {
      this.car = res.car; // Giả sử API trả về { car: {...} }
    });
  }

  onConfirm() {
    this.bookingSvc.confirmDeposit(this.booking.idbooking)
      .subscribe(() => {
        this.status = 'Confirmed';
      });
  }

  confirmDeposit() {
    Swal.fire({
      title: 'Xác nhận nhận tiền cọc',
      text: 'Vui lòng xác nhận rằng bạn đã nhận được tiền đặt cọc cho lần đặt chỗ này. Điều này sẽ cho phép khách hàng nhận xe vào ngày và giờ đã thỏa thuận.',
      icon: 'info',
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
        this.onConfirm();
      }
    });
  }
}