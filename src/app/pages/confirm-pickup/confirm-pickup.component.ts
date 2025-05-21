import { Component, OnInit } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap }         from 'rxjs/operators';
import { of }                     from 'rxjs';
import { BookingService } from '../../services/booking/booking.service';
import { CarService } from '../../services/car/car.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-confirm-pickup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-pickup.component.html',
  styleUrls: ['./confirm-pickup.component.css']
})
export class ConfirmPickupComponent implements OnInit {
  idbooking!: number;
  booking: any = null;
  user: any    = null;
  car: any     = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingSvc: BookingService,
    private profileSvc: ProfileService,
    private carSvc: CarService
  ) {}

  ngOnInit(): void {
    this.idbooking = Number(this.route.snapshot.paramMap.get('idbooking'));

    // Load booking → user → car
    this.bookingSvc.getBookingById(this.idbooking).pipe(
      tap(b => this.booking = b),
      switchMap(() => this.profileSvc.getUser()),
      tap(u => this.user = u),
      switchMap(() => {
        const carId = this.booking.carIdcar;
        return carId ? this.carSvc.getCarDetails(carId) : of(null);
      })
    ).subscribe({
      next: c => this.car = c,
      error: err => this.error = 'Không tải được dữ liệu'
    });
  }

  onConfirmPickUp() {
    this.bookingSvc.confirmPickUp(this.idbooking).subscribe({
      next: () => this.router.navigate([`/returncar/${this.idbooking}`]),
      error: err => this.error = 'Xác nhận thất bại'
    });
  }

  onCancelBooking() {
    this.bookingSvc.cancelBooking(this.idbooking).subscribe({
      next: () => this.router.navigate([`/complete/${this.idbooking}`]),
      error: err => this.error = 'Hủy booking thất bại'
    });
  }
}