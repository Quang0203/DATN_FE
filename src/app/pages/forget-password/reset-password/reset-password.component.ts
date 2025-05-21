import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';

  email!: string;
  password = '';
  confirmPassword = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  // ngOnInit() {
  //   // đọc param email từ URL
  //   this.route.paramMap.subscribe(params => {
  //     const e = params.get('email');
  //     if (e) {
  //       this.email = decodeURIComponent(e);
  //     } else {
  //       // không tìm thấy email thì back về trang login hoặc báo lỗi
  //       // this.router.navigate(['/login']);
  //       alert('Email not found or invalid');
  //       this.router.navigate(['/forget-password']);
  //     }
  //   });
  // }

  // onSubmit() {
  //   if (this.password !== this.confirmPassword) {
  //     alert('Passwords do not match');
  //     return;
  //   }

  //   this.http.put(
  //     'http://localhost:8080/user/forgot',
  //     {
  //       email: this.email,
  //       newpassword: this.password,
  //       confirmpassword: this.confirmPassword
  //     },
  //     { headers: { 'Content-Type': 'application/json' } }
  //   ).subscribe({
  //     next: () => {
  //       alert('Password reset successful');
  //       this.router.navigate(['/login']);
  //     },
  //     error: () => {
  //       alert('Password reset failed');
  //     }
  //   });
  // }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const t = params.get('token');
      if (t) {
        this.token = t;
      } else {
        alert('Token không hợp lệ');
        this.router.navigate(['/forget-password']);
      }
    });
  }
  
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
    this.http.post(
      'http://localhost:8080/user/reset-password',
      {
        token: this.token,
        newpassword: this.password,
        confirmpassword: this.confirmPassword
      },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        alert('Đổi mật khẩu thành công');
        this.router.navigate(['/login']);
      },
      error: () => alert('Không thể đổi mật khẩu')
    });
  }
  
}
