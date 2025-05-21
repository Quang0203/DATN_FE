// src/app/pages/return-url/return-url.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking/booking.service';


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
  status!: string | null;
  booking: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingSvc: BookingService
  ) {}

  ngOnInit(): void {
    // Đọc query params
    this.vnpAmount = this.route.snapshot.queryParamMap.get('vnp_Amount');
    this.idbooking  = this.route.snapshot.queryParamMap.get('vnp_OrderInfo');
    this.status     = this.route.snapshot.queryParamMap.get('vnp_ResponseCode');

    if (this.idbooking) {
      this.bookingSvc.getBookingById(+this.idbooking).subscribe({
        next: data => this.booking = data,
        error: err => console.error('Fetch booking failed', err)
      });
    }
  }

  onBack() {
    this.router.navigate(['/customer']);
  }

  onComplete() {
    if (this.idbooking) {
      this.router.navigate([`/customer/booking/book/${this.idbooking}`]);
    }
  }
}
