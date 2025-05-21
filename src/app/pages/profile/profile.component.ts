import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileData } from '../../interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NavbarOwnerComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName = '';
  role = '';
  selectedTab: 'PersonalInfo' | 'Security' = 'PersonalInfo';

  profileData: ProfileData = {
    iduser: 0,
    name: '',
    dateofbirth: '',
    nationalidno: 0,
    phoneno: '',
    email: '',
    address: '',
    housenumber: '',
    ward: '',
    district: '',
    city: '',
    drivinglicense: '',
    password: '',
    role: 'CUSTOMER'
  };
  confirmPassword = '';
  confirmPasswordError = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadProfile();
  }

  selectTab(tab: 'PersonalInfo' | 'Security') {
    this.selectedTab = tab;
  }

  private loadUserInfo() {
    this.profileService.getUser().subscribe({
      next: res => {
        // nếu API trả về { code, message, result }
        const u = (res as any).result ?? res;
        this.userName = u.name;
        this.role = u.role;
      },
      error: err => console.error(err)
    });
  }

  private loadProfile() {
    this.profileService.getProfile().subscribe({
      next: res => {
        const data = (res as any).result ?? res;
        // tách address thành các phần
        const parts = (data.address || '').split(',');
        this.profileData = {
          ...data,
          housenumber: parts[3] || '',
          ward: parts[2] || '',
          district: parts[1] || '',
          city: parts[0] || ''
        };
      },
      error: err => console.error(err)
    });
  }

  handleSubmitProfile() {
    // gộp lại address
    this.profileData.address =
      `${this.profileData.housenumber},${this.profileData.ward},` +
      `${this.profileData.district},${this.profileData.city}`;

    this.profileService
      .updateProfile(this.profileData.iduser, this.profileData)
      .subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.router.navigateByUrl('/profile');
        },
        error: err => console.error(err)
      });
  }

  handleSubmitPassword() {
    if (this.profileData.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Mật khẩu không khớp';
      return;
    }

    this.profileService
      .updatePassword(this.profileData.iduser, this.confirmPassword)
      .subscribe({
        next: () => {
          alert('Cập nhật mật khẩu mới thành công!');
          this.router.navigateByUrl('/profile');
        },
        error: err => console.error(err)
      });
  }

  // thêm hàm public để chuyển trang
  goBack(): void {
    switch (this.role.toUpperCase()) {
      case 'CAROWNER':
        this.router.navigate(['/car-owner']).then(() => {
          window.scrollTo(0, 0);
        });
        break;
      case 'CUSTOMER':
        this.router.navigate(['/customer']).then(() => {
          window.scrollTo(0, 0);
        });
        break;
      default:
        this.router.navigate(['/']).then(() => {
          window.scrollTo(0, 0);
        });
        break;
    }
  }
}