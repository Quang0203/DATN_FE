import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car, SearchCarRequest, SearchCarResponse, SearchCarNewRequest, ViewCarDetailsResponse } from '../../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class CarService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('authToken')!;
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
  }

  // === Các phương thức cũ ===
  searchCar(request: SearchCarRequest): Observable<SearchCarResponse[]> {
    return this.http.post<SearchCarResponse[]>(`${API_URL}/searchCar/new`, request, this.getHeaders());
  }

  searchCarNew(req: SearchCarNewRequest): Observable<SearchCarResponse[]> {
    return this.http
      .post<{ result: SearchCarResponse[] }>(`${API_URL}/searchCar/new`, req, this.getHeaders())
      .pipe(map(res => res.result));
  }

  getCarDetails(id: number): Observable<ViewCarDetailsResponse> {
    return this.http.get<ViewCarDetailsResponse>(`${API_URL}/cars/${id}`, this.getHeaders());
  }

  getCarAverageRating(idcar: number): Observable<number> {
    return this.http.get<number>(`${API_URL}/viewFeedbackReport/cars/${idcar}/averageRatingByIdCar`, this.getHeaders());
  }

  // ==== MỚI: Add Car ====
  addCar(data: Car): Observable<{ result: { idcar: number } }> {
    return this.http.post<{ result: { idcar: number } }>(`${API_URL}/car/addcar`, data, this.getHeaders());
  }

  addTerm(idcar: number, nameterms: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/car/addterm`, { idcar, nameterms }, this.getHeaders());
  }

  addFunction(idcar: number, namefunctions: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/car/addfunction`, { idcar, namefunctions }, this.getHeaders());
  }

  // ==== MỚI: My Car (Car Owner) ====
  /** Lấy danh sách xe của owner */
  getMyCars(): Observable<Car[]> {
    return this.http
      .get<{ result: Car[] }>(`${API_URL}/stoprentingcar/getlistcarbyidcarowner`, this.getHeaders())
      .pipe(map(res => res.result));
  }

  /** Stop renting một xe */
  stopCar(idcar: number): Observable<{ result: { status: string } }> {
    return this.http.post<{ result: { status: string } }>(
      `${API_URL}/stoprentingcar/${idcar}`,
      {},
      this.getHeaders()
    );
  }

  viewCarDetails(idcar: number): Observable<ViewCarDetailsResponse> {
    return this.http.get<ViewCarDetailsResponse>(
      `${API_URL}/car/get/${idcar}`,
      this.getHeaders()
    );
  }

  editCar(idcar: number, data: Car): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/car/editcar/${idcar}`,
      data,
      this.getHeaders()
    );
  }
}
