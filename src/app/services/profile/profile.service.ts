import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Lấy token từ localStorage nếu đang chạy trong trình duyệt
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null; // Trả về null khi chạy trên server
  }

  /**
   * Xây dựng header Authorization nếu có token
   */
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
   * Lấy thông tin người dùng
   */
  getUser(): Observable<any> {
    return this.http
      .get<{ code: number; message: string; result: any }>(
        `${API_URL}/user/myInfo`,
        this.getHeaders()
      )
      .pipe(
        map(resp => resp.result)
      );
  }

  /**
   * Chuyển tiếp sang getUser
   */
  getProfile(): Observable<any> {
    return this.getUser();
  }

  /**
   * Cập nhật thông tin cá nhân
   */
  updateProfile(id: number, profile: any): Observable<any> {
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