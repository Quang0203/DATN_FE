import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedbackResponse } from '../../interfaces';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('authToken')!;
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
  }

  getFeedbackReport(rate?: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${API_URL}/viewFeedbackReport`, {
      ...this.getHeaders(),
      params: rate !== undefined ? { rate } : {}
    });
  }

  getAverageRating(): Observable<number> {
    return this.http.get<number>(`${API_URL}/viewFeedbackReport/averageRating`, this.getHeaders());
  }

  // Phương thức mới để lấy điểm đánh giá trung bình của một xe
  getAverageRatingByCarId(carId: number): Observable<number> {
    return this.http.get<number>(`${API_URL}/viewFeedbackReport/cars/${carId}/averageRatingByIdCar`, this.getHeaders());
  }
}
