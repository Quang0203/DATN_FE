// src/app/pages/customer/booking/booking.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarOwnerComponent } from '../../../components/navbar-owner/navbar-owner.component';
import { BookingItemCustomerComponent } from '../../../components/booking-item-customer/booking-item-customer.component';
import { BookingItemComponent } from '../../../components/booking-item/booking-item.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarOwnerComponent,
    BookingItemComponent
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  car: any = null;
  userName = '';
  role: 'CUSTOMER' | 'CAROWNER' = 'CUSTOMER';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    // 1) Lấy user
    this.http.get<any>('http://localhost:8080/user/myInfo', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: r => {
        this.userName = r.result.name;
        this.role = r.result.role;
      },
      error: () => {}
    });

    // 2) Đọc query param idCar
    this.route.queryParamMap.subscribe(params => {
      const idCar = params.get('idCar');
      console.log("idCar: " + idCar);
      if (idCar) this.fetchCar(idCar, token);
    });
  }

  private fetchCar(idCar: string, token: string) {
    this.http.get<any>(`http://localhost:8080/getcar/${idCar}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: r => {this.car = r.result; console.log("fetching car result: " + r.result);},
      error: err => console.error('Error fetching car', err)
    });
  }
}
