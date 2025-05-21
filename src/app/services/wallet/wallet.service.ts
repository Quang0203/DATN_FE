import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TopUpRequest, ViewWalletResponse, WithdrawRequest } from '../../interfaces';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('authToken')!;
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
  }

  getWallet(): Observable<ViewWalletResponse> {
    return this.http.get<ViewWalletResponse>(`${API_URL}/viewWallet`, this.getHeaders());
  }

  topUp(data: TopUpRequest): Observable<ViewWalletResponse> {
    return this.http.post<ViewWalletResponse>(`${API_URL}/viewWallet/topup`, data, this.getHeaders());
  }

  withdraw(data: WithdrawRequest): Observable<ViewWalletResponse> {
    return this.http.post<ViewWalletResponse>(`${API_URL}/viewWallet/withdraw`, data, this.getHeaders());
  }

  searchTransactions(start: string, end: string): Observable<ViewWalletResponse> {
    return this.http.get<ViewWalletResponse>(`${API_URL}/viewWallet/search`, {
      ...this.getHeaders(),
      params: { startDate: start, endDate: end }
    });
  }
}
