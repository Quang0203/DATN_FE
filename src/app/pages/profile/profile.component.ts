import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: number | null = null;
  selectedDistrict: number | null = null;
  selectedWard: number | null = null;

  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProvinces();
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

        // Tách địa chỉ thành các phần
        const parts = (data.address || '').split(',');
        console.log('Address parts:', parts);

        // Lưu dữ liệu vào profileData
        this.profileData = {
          ...data,
          housenumber: parts[0]?.trim() || '',
          ward: parts[1]?.trim() || '',
          district: parts[2]?.trim() || '',
          city: parts[3]?.trim() || ''
        };

        // Tìm mã code của Tỉnh/Thành phố
        const province = this.provinces.find(p => p.name.trim() === this.profileData.city);
        if (province) {
          this.selectedProvince = province.code;

          // Gọi API để tải danh sách Quận/Huyện
          this.http.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`).subscribe({
            next: (data: any) => {
              this.districts = data.districts;

              // Tìm mã code của Quận/Huyện
              const district = this.districts.find(d => d.name.trim() === this.profileData.district);
              if (district) {
                this.selectedDistrict = district.code;

                // Gọi API để tải danh sách Phường/Xã
                this.http.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`).subscribe({
                  next: (data: any) => {
                    this.wards = data.wards;

                    // Tìm mã code của Phường/Xã
                    const ward = this.wards.find(w => w.name.trim() === this.profileData.ward);
                    if (ward) {
                      this.selectedWard = ward.code;
                    }
                  },
                  error: err => console.error('Lỗi khi lấy danh sách xã/phường:', err)
                });
              }
            },
            error: err => console.error('Lỗi khi lấy danh sách quận/huyện:', err)
          });
        }
      },
      error: err => console.error(err)
    });
  }

  private fetchProvinces() {
    this.http.get('https://provinces.open-api.vn/api/p').subscribe({
      next: (data: any) => {
        this.provinces = data;

        // Sau khi tải danh sách Tỉnh/Thành phố, gọi loadProfile
        this.loadProfile();
        this.loadUserInfo()
      },
      error: err => console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', err)
    });
  }

  onProvinceChange(provinceId: number | null) {
    if (!provinceId) return;
    this.selectedProvince = provinceId;
    this.districts = [];
    this.wards = [];
    this.selectedDistrict = null;
    this.selectedWard = null;
    this.profileData.district = '';
    this.profileData.ward = '';

    this.http.get(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`).subscribe({
      next: (data: any) => {
        this.districts = data.districts;
      },
      error: err => console.error('Lỗi khi lấy danh sách quận/huyện:', err)
    });
  }

  onDistrictChange(districtId: number | null) {
    if (!districtId) return;
    this.selectedDistrict = districtId;
    this.wards = [];
    this.selectedWard = null;
    this.profileData.ward = '';

    this.http.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`).subscribe({
      next: (data: any) => {
        this.wards = data.wards;
      },
      error: err => console.error('Lỗi khi lấy danh sách xã/phường:', err)
    });
  }

  onWardChange(wardId: number | null) {
    if (!wardId) return;
    this.selectedWard = wardId;
  }

  handleSubmitProfile() {
    const provinceName = this.provinces.find(p => String(p.code) === String(this.selectedProvince))?.name || '';
    const districtName = this.districts.find(d => String(d.code) === String(this.selectedDistrict))?.name || '';
    const wardName = this.wards.find(w => String(w.code) === String(this.selectedWard))?.name || '';

    this.profileData.address = `${this.profileData.housenumber}, ${wardName}, ${districtName}, ${provinceName}`;

    this.profileService.updateProfile(this.profileData.iduser, this.profileData).subscribe({
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