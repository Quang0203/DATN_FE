import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email = '';
  constructor(private router: Router, private http: HttpClient) {}
  // constructor(private router: Router) {}

  // onSubmit() {
  //   // encodeURIComponent giữ nguyên hành vi Next.js
  //   const e = encodeURIComponent(this.email.trim());
  //   this.router.navigate(['/forget-password', 'reset-password', e]);
  // }

  onSubmit() {
  this.http.post(
    'http://localhost:8080/user/forgot',
    { email: this.email.trim()}
  ).subscribe({
    next: () => alert('Email đã gửi! Vui lòng kiểm tra hộp thư.'),
    error: () => alert('Gửi email thất bại.')
  });
}

}
