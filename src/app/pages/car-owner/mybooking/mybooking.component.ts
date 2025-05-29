// src/app/pages/car-owner/mybooking/mybooking.component.ts
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking/booking.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { CommonModule } from '@angular/common';
import { NavbarOwnerComponent } from '../../../components/navbar-owner/navbar-owner.component';
import { BenefitsSectionComponent } from '../../../components/benefits-section/benefits-section.component';

import { FooterComponent } from '../../../components/footer/footer.component';
import { BookingComponent } from './booking/booking.component';
import { PaginatedResponse } from '../../../interfaces';

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
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;

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
    this.loadBookings(this.currentPage, this.pageSize);
  }

  loadBookings(page: number, size: number) {
    this.bookingSvc.getOwnerBookingsNew(page, size).subscribe({
      next: (response: PaginatedResponse<any>) => {
        this.bookings = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      },
      error: err => console.error('Error fetching bookings:', err)
    });
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBookings(this.currentPage, this.pageSize);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBookings(this.currentPage, this.pageSize);
    }
  }
}