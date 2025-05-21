// src/app/pages/car-owner/mybooking/mybooking.component.ts
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking/booking.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { CommonModule } from '@angular/common';
import { NavbarOwnerComponent } from '../../../components/navbar-owner/navbar-owner.component';
import { BenefitsSectionComponent } from '../../../components/benefits-section/benefits-section.component';

import { FooterComponent } from '../../../components/footer/footer.component';
import { BookingComponent } from './booking/booking.component';

@Component({
  selector: 'app-mybooking',
  standalone: true,
  imports: [
    CommonModule,                 // <--- thêm
    NavbarOwnerComponent,
    BookingComponent,             // <--- thêm
    FooterComponent
  ],
  templateUrl: './mybooking.component.html',
  styleUrls: ['./mybooking.component.css']
})
export class MybookingComponent implements OnInit {
  userName = '';
  role = '';
  bookings: any[] = [];

  constructor(
    private bookingSvc: BookingService,
    private profileSvc: ProfileService
  ) {}

  ngOnInit(): void {
    // 1) load user for navbar
    this.profileSvc.getProfile().subscribe(u => {
      this.userName = u.name;
      this.role = (u as any).role;
    });

    // 2) load bookings
    this.bookingSvc.getOwnerBookings().subscribe(res => this.bookings = res.result);
  }
}
