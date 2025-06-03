import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    province: '',
    district: '',
    ward: '',
    street: '',
    drivinglicense: '',
    role: 'CUSTOMER',
    password: '',
    wallet: 200
  };
  message = '';
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: number | null = null;
  selectedDistrict: number | null = null;
  selectedWard: number | null = null;

  private API_URL = 'http://localhost:8080'

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.fetchProvinces();
  }

  private fetchProvinces() {
    this.http.get('https://provinces.open-api.vn/api/p').subscribe({
      next: (data: any) => {
        this.provinces = data;
        console.log('Danh sách tỉnh/thành phố:', this.provinces);
      },
      error: err => console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', err)
    });
  }

  onProvinceChange(provinceId: number | null) {
    if (!provinceId) return;
    this.selectedProvince = provinceId;
    console.log('Selected Province ID:', this.selectedProvince);
    this.districts = [];
    this.wards = [];
    this.selectedDistrict = null;
    this.selectedWard = null;
    this.registerData.district = '';
    this.registerData.ward = '';

    this.http.get(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`).subscribe({
      next: (data: any) => {
        console.log('Dữ liệu quận/huyện:', data.districts);
        this.districts = data.districts;
      },
      error: err => console.error('Lỗi khi lấy danh sách quận/huyện:', err)
    });
  }

  onDistrictChange(districtId: number | null) {
    if (!districtId) return;
    this.selectedDistrict = districtId;
    console.log('Selected District ID:', this.selectedDistrict);
    this.wards = [];
    this.selectedWard = null;
    this.registerData.ward = '';

    this.http.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`).subscribe({
      next: (data: any) => {
        console.log('Dữ liệu xã/phường:', data.wards);
        this.wards = data.wards;
      },
      error: err => console.error('Lỗi khi lấy danh sách xã/phường:', err)
    });
  }

  onWardChange(wardid: number | null) {
    if (!wardid) return; // Thêm check null
    this.selectedWard = wardid;
    console.log('Selected District ID:', this.selectedDistrict);
  }

  async handleRegister() {
    try {
      // Validation
      if (!this.registerData.name || !this.registerData.dateofbirth || !this.registerData.nationalidno ||
          !this.registerData.email || !this.registerData.phoneno || !this.selectedProvince ||
          !this.selectedDistrict || !this.selectedWard || !this.registerData.street ||
          !this.registerData.drivinglicense || !this.registerData.password) {
        this.message = 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.';
        return;
      }

      // Kết hợp các trường thành address
      const provinceName = this.provinces.find(p => String(p.code) === String(this.selectedProvince))?.name || '';
      const districtName = this.districts.find(d => String(d.code) === String(this.selectedDistrict))?.name || '';
      const wardName = this.wards.find(w => String(w.code) === String(this.selectedWard))?.name || '';
      console.log('Selected Province:', provinceName);
      console.log('Provinces code: ', this.selectedProvince);
      this.registerData.address = `${this.registerData.street}, ${wardName}, ${districtName}, ${provinceName}`;
      console.log('Địa chỉ:', this.registerData.address);

      // Gửi dữ liệu lên server
      const res: any = await this.http.post(
        `${this.API_URL}/user/create`,
        this.registerData,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).toPromise();

      if (res.message === 'Success') {
        this.message = 'Đăng ký thành công! Vui lòng đăng nhập.';
        setTimeout(() => this.router.navigateByUrl('/login'), 1500);
      } else {
        this.message = 'Đăng ký thất bại: ' + (res.message || '');
      }
    } catch (err: any) {
      console.error(err);
      this.message = 'Có lỗi xảy ra khi đăng ký.';
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}