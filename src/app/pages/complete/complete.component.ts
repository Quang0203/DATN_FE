import { Component, OnInit } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ActivatedRoute }         from '@angular/router';

import { switchMap }              from 'rxjs/operators';
import { of }                     from 'rxjs';
import { BookingService } from '../../services/booking/booking.service';
import { ProfileService } from '../../services/profile/profile.service';
import { CarService } from '../../services/car/car.service';

@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {
  idbooking!: number;
  booking: any = null;
  user: any    = null;
  car: any     = null;

  constructor(
    private route: ActivatedRoute,
    private bookingSvc: BookingService,
    private profileSvc: ProfileService,
    private carSvc: CarService
  ) {}

  ngOnInit(): void {
    this.idbooking = Number(this.route.snapshot.paramMap.get('idbooking'));

    // 1. Load booking
    this.bookingSvc.getBookingById(this.idbooking).pipe(
      switchMap(b => {
        this.booking = b;
        // 2. Load user info
        return this.profileSvc.getUser();
      }),
      switchMap(u => {
        this.user = u;
        // 3. Load car only if booking has carIdcar
        const carId = this.booking.carIdcar;
        return carId ? this.carSvc.getCarDetails(carId) : of(null);
      })
    ).subscribe({
      next: c => this.car = c,
      error: err => console.error(err)
    });
  }
}