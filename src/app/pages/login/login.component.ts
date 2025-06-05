import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  isRegister = false;
  // Use a generic any type to allow dynamic keys in template
  registerData: any = {
    name: '',
    dateofbirth: '',
    nationalidno: 0,
    email: '',
    phoneno: '',
    address: '',
    drivinglicense: '',
    role: 'CUSTOMER',
    password: '',
    wallet: 200
  };

  constructor(private http: HttpClient, private router: Router) {}

  private API_URL = 'http://localhost:8080';

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  async handleSubmit() {
    try {
      const res: any = await this.http.post(
        `${this.API_URL}/auth/login`,
        { email: this.email, password: this.password },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).toPromise();

      if (res.message === 'Success') {
        localStorage.setItem('authToken', res.result.token);
        this.message = 'Login success';
        const user: any = await this.http.get(
          `${this.API_URL}/user/myInfo`,
          this.getAuthHeaders()
        ).toPromise();
        const role = user.result.role;
        this.router.navigate([role === 'CAROWNER' ? '/car-owner' : '/customer']);
      } else {
        this.message = 'Login failed';
      }
    } catch (err) {
      console.error(err);
      this.message = 'An error occurred during login';
    }
  }

  async handleRegister(e: Event) {
    e.preventDefault();
    try {
      const res: any = await this.http.post(
        `${this.API_URL}/user/create`,
        this.registerData,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).toPromise();

      if (res.message === 'Success') {
        this.message = 'Registration success';
        // Auto login
        this.email = this.registerData.email;
        this.password = this.registerData.password;
        await this.handleSubmit();
      } else {
        this.message = 'Registration failed';
      }
    } catch (err) {
      console.error(err);
      this.message = 'An error occurred during registration';
    }
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.message = '';
  }

  goForgetPassword() {
    this.router.navigate(['/forget-password']);
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
