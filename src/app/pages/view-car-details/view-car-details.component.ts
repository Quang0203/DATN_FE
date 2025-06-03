import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProfileService } from '../../services/profile/profile.service';
import { CarService } from '../../services/car/car.service';
import { BookingService } from '../../services/booking/booking.service';
import { ViewCarDetailsResponse } from '../../interfaces';

@Component({
  selector: 'app-view-car-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarOwnerComponent,
    FooterComponent,
  ],
  templateUrl: './view-car-details.component.html',
  styleUrls: ['./view-car-details.component.css']
})
export class ViewCarDetailsComponent implements OnInit {
  carDetails: ViewCarDetailsResponse | null = null;
  averageRating: number | null = null;
  bookings: any[] = []; // Danh sách booking của xe
  loading = true;
  userName = '';
  role = '';
  activeTab = 'basic';
  idcar: number = 0;
  private isBrowser: boolean;

  statusMap: { [key: string]: string } = {
    'Available': 'Có sẵn',
    'Booked': 'Đã đặt',
    'Stopped': 'Dừng cho thuê'
  };

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private carSvc: CarService,
    private profileSvc: ProfileService,
    private bookingSvc: BookingService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.profileSvc.getProfile().subscribe({
      next: user => {
        this.userName = user.name;
        this.role = (user as any).role;
      },
      error: err => console.error(err)
    });

    this.route.params.subscribe(params => {
      this.idcar = +params['idcar'];
      this.fetchCarDetails();
    });
  }

  fetchCarDetails() {
    if (!this.idcar) return;
    this.loading = true;

    Promise.all([
      this.carSvc.getCarDetails(this.idcar).toPromise(),
      this.carSvc.getCarAverageRating(this.idcar).toPromise(),
      this.bookingSvc.getBookingsByCarId(this.idcar).toPromise()
    ])
      .then(([carDetailsRes, ratingRes, bookingsRes]) => {
        this.carDetails = carDetailsRes ?? null;
        this.averageRating = ratingRes ?? null;
        this.bookings = (bookingsRes as any)?.result || [];
      })
      .catch(error => {
        console.error('Error fetching car details, rating, or bookings', error);
        this.carDetails = null;
        this.averageRating = null;
        this.bookings = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  handleBook() {
    this.router.navigate(['/customer/booking'], { queryParams: { idCar: this.idcar } });
  }

  get additionalFunctions() {
    return this.carDetails?.additionalFunctions?.namefunctions?.split(', ') || [];
  }

  get termsOfUse() {
    return this.carDetails?.termsOfUse?.nameterms?.split(', ') || [];
  }

  // Lọc booking đang active (chưa hoàn thành hoặc bị hủy)
  get activeBookings() {
    return this.bookings.filter(booking => 
      booking.status && 
      !['Completed', 'Cancelled'].includes(booking.status)
    );
  }

  // Format datetime cho hiển thị
  formatDateTime(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStarClass(index: number, rating: number): string {
    if (rating >= index + 1) {
      return 'fas fa-star';
    } else if (rating > index) {
      return 'fas fa-star partial-star';
    } else {
      return 'far fa-star';
    }
  }

  getStarWidth(index: number, rating: number): string {
    if (rating >= index + 1) {
      return '100%';
    } else if (rating > index) {
      const percentage = (rating - index) * 100;
      return `${percentage}%`;
    } else {
      return '0%';
    }
  }

  getFilledWidth(index: number, rating: number): string {
    if (rating >= index + 1) {
      return '100%';
    } else if (rating > index) {
      const percentage = (rating - index) * 100;
      return `${percentage}%`;
    } else {
      return '0%';
    }
  }
}