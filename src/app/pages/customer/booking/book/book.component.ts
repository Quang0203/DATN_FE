import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NavbarOwnerComponent } from '../../../../components/navbar-owner/navbar-owner.component';
import { BookingCardComponent } from '../../../../components/booking-card/booking-card.component';

@Component({
  selector: 'app-book-car',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NavbarOwnerComponent,
    BookingCardComponent
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  booking: any = null;
  car: any = null;
  userName = '';
  role: 'CUSTOMER' | 'CAROWNER' = 'CUSTOMER';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    const token = localStorage.getItem('authToken') ?? '';

    // 1) Lấy user info
    this.http.get<any>('http://localhost:8080/user/myInfo', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => {
        this.userName = res.result.name;
        this.role     = res.result.role;
      },
      error: err => console.error('Error fetching user:', err)
    });

    // 2) Lấy booking theo param idbooking
    this.route.paramMap.subscribe(params => {
      const idbooking = params.get('idbooking');
      if (!idbooking) return;

      this.http.get<any>(`http://localhost:8080/getbooking/${idbooking}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: res => {
          // API Next.js trả về { code, message, result: {...} }
          this.booking = res.result;
          console.log('Booking:', this.booking);
          this.loadCar(this.booking.result.carIdcar, token);
        },
        error: err => console.error('Error fetching booking:', err)
      });
    });
  }

  private loadCar(idcar: number, token: string) {
    this.http.get<any>(`http://localhost:8080/getcar/${idcar}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => {this.car = res.result; console.log('Car:', this.car);},
      error: err => console.error('Error fetching car:', err)
    });
  }
}
