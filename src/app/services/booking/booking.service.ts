// src/app/services/booking/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ViewBookingListResponse,
  EditBookingDetailsRequest
} from '../../interfaces';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token not found');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** ==== Dành cho Customer ==== */
  getBookingsForCurrentUser(): Observable<ViewBookingListResponse[]> {
    return this.http.get<ViewBookingListResponse[]>(
      `${API_URL}/view-bookings`,
      { headers: this.getAuthHeaders() }
    );
  }
  getBookingById(id: number): Observable<ViewBookingListResponse> {
    return this.http.get<ViewBookingListResponse>(
      `${API_URL}/view-bookings/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
  updateBooking(
    id: number,
    bookingRequest: EditBookingDetailsRequest
  ): Observable<ViewBookingListResponse> {
    return this.http.put<ViewBookingListResponse>(
      `${API_URL}/edit-booking/${id}`,
      bookingRequest,
      { headers: this.getAuthHeaders() }
    );
  }

  /** ==== Dành cho Car Owner ==== */
  getOwnerBookings(): Observable<any> {
    return this.http.get<any>(
      `${API_URL}/getbooking/carowner`,
      { headers: this.getAuthHeaders() }
    );
  }
  confirmDeposit(idbooking: number): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/confirmdeposit/${idbooking}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** ==== MỚI: Xác nhận pick-up và hủy booking ==== */
  confirmPickUp(idbooking: number): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/confirmpickup/${idbooking}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  cancelBooking(idbooking: number): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/cancelbooking/${idbooking}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
