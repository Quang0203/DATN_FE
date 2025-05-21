import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-booking-item-customer',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './booking-item-customer.component.html',
  styleUrls: ['./booking-item-customer.component.css']
})
export class BookingItemCustomerComponent implements OnInit {
  @Input() booking!: any;
  car: any = null;

  statusMap: Record<string,string> = {
    'Pending Deposit': 'DANG CHO THANH TOAN',
    'Confirmed': 'DA DUOC CHU XE XAC NHAN THANH TOAN',
    'Pending Payment': 'DANG CHO THANH TOAN NOT HOA DON',
    'In - Progress': 'PHUONG TIEN DANG DUOC SU DUNG',
    'Cancelled': 'HOA DON DA BI HUY',
    'Completed': 'Completed'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCar(this.booking.carIdcar);
  }

  fetchCar(idcar: number) {
    this.http.get<any>(`http://localhost:8080/getcar/${idcar}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).subscribe({
      next: res => this.car = res.result,
      error: err => console.error('Error fetching car:', err)
    });
  }
}
