import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
registerData: any = {
    name: '',
    dateofbirth: '',
    nationalidno: '',
    email: '',
    phoneno: '',
    address: '',
    drivinglicense: '',
    role: 'CUSTOMER',
    password: '',
    wallet: 200
  };
  message = '';

  fields = [
    { label: 'Họ & tên', key: 'name', type: 'text' },
    { label: 'Ngày sinh', key: 'dateofbirth', type: 'date' },
    { label: 'CMND/CCCD', key: 'nationalidno', type: 'text' },
    { label: 'Email', key: 'email', type: 'email' },
    { label: 'Số điện thoại', key: 'phoneno', type: 'text' },
    { label: 'Địa chỉ', key: 'address', type: 'text' },
    { label: 'Bằng lái xe', key: 'drivinglicense', type: 'text' },
    { label: 'Mật khẩu', key: 'password', type: 'password' },
  ];


  private API_URL = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async handleRegister() {
    try {
      const res: any = await this.http.post(
        `${this.API_URL}/user/create`,
        this.registerData,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).toPromise();

      if (res.message === 'Success') {
        this.message = 'Đăng ký thành công! Vui lòng đăng nhập.';
        // Chuyển về trang login
        setTimeout(() => this.router.navigateByUrl('/login'), 1500);
      } else {
        this.message = 'Đăng ký thất bại: ' + (res.message || '');
      }
    } catch (err:any) {
      console.error(err);
      this.message = 'Có lỗi xảy ra khi đăng ký.';
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}