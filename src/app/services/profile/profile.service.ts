// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileData } from '../../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  /**
   * Lấy token từ localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Xây dựng header Authorization nếu có token
   */
  // getUser(): Observable<ProfileData> {
  //   return this.http.get<ProfileData>(`${API_URL}/user/myInfo`, this.getHeaders());
  // }
  private getHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    console.log('Token:', token); // Debugging line to check the token value
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }

  /**
   * Tương đương với getUser() trong Next.js
   * Trả về Observable<ProfileData>
   */
  getUser(): Observable<ProfileData> {
    return this.http
      .get<{ code: number; message: string; result: ProfileData }>(
        `${API_URL}/user/myInfo`,
        this.getHeaders()
      )
      .pipe(
        map(resp => resp.result)      // <-- unwrap ở đây
      );
  }
  /**
   * Chuyển tiếp sang getUser (nếu bạn vẫn muốn đặt tên getProfile)
   */
  getProfile(): Observable<ProfileData> {
    return this.getUser();
  }

  /**
   * Cập nhật thông tin cá nhân
   */
  updateProfile(id: number, profile: ProfileData): Observable<any> {
    return this.http.put(
      `${API_URL}/editProfile/userinfo/${id}`,
      profile,
      this.getHeaders()
    );
  }

  /**
   * Cập nhật mật khẩu
   */
  updatePassword(id: number, password: string): Observable<any> {
    return this.http.put(
      `${API_URL}/editProfile/userpass/${id}`,
      { password },
      this.getHeaders()
    );
  }
}
