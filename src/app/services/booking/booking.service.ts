// src/app/services/booking/booking.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ViewBookingListResponse,
  EditBookingDetailsRequest,
  PaginatedResponse
} from '../../interfaces';
import { isPlatformBrowser } from '@angular/common';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let token = null;
    if (isPlatformBrowser(this.platformId)) { 
      token = localStorage.getItem('authToken');
    }
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  /** ==== Dành cho Customer ==== */
  getBookingsForCurrentUser(): Observable<ViewBookingListResponse[]> {
    return this.http.get<ViewBookingListResponse[]>(
      `${API_URL}/view-bookings`,
      { headers: this.getAuthHeaders() }
    );
  }

  getBookingsForCurrentUserNew(page: number, size: number): Observable<PaginatedResponse<ViewBookingListResponse>> {
    const url = `${API_URL}/view-bookings?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<ViewBookingListResponse>>(url, { headers: this.getAuthHeaders() });
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

   /** ==== MỚI: Lấy danh sách booking của xe ==== */
  getBookingsByCarId(carId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${API_URL}/searchCar/bookingcar/${carId}`,
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

  getOwnerBookingsNew(page: number, size: number): Observable<PaginatedResponse<any>> {
    const url = `${API_URL}/getbooking/carowner/paginated?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<any>>(url, { headers: this.getAuthHeaders() });
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

  confirmPayment(idbooking: number): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/confirmfinalpayment/${idbooking}`,
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

  /** ==== MỚI: Xử lý callback thanh toán từ cổng (API /returnurl) ==== */
  handlePaymentReturnUrl({ vnp_ResponseCode, vnp_OrderInfo }: { vnp_ResponseCode: string; vnp_OrderInfo: string; }): Observable<any> {
    let params = new HttpParams();
    params = params.append('vnp_ResponseCode', vnp_ResponseCode);
    params = params.append('vnp_OrderInfo', vnp_OrderInfo);
    return this.http.get<any>(`${API_URL}/banktransfer/returnurl/paiddeposit`, { params, headers: this.getAuthHeaders() });
  }

  handleCompletePaymentReturnUrl(vnp_ResponseCode: string, vnp_OrderInfo: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('vnp_ResponseCode', vnp_ResponseCode);
    params = params.append('vnp_OrderInfo', vnp_OrderInfo);
    return this.http.get<any>(`${API_URL}/banktransfer/returnurl/completepayment`, { params, headers: this.getAuthHeaders() });
  }
}