import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';

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
    drivinglicense: '', // Lưu link ảnh bằng lái
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
  isUploading: boolean = false; // Trạng thái upload ảnh
  drivingLicensePreview: string | null = null;

  private API_URL = 'http://localhost:8080';
  private CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/quangkedo/image/upload';
  private CLOUDINARY_PRESET = 'datnupload'; // Thay bằng preset của bạn

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
    this.registerData.district = '';
    this.registerData.ward = '';

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
    this.registerData.ward = '';

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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.CLOUDINARY_PRESET);
      formData.append('folder', 'DrivingLicense');

      try {
        const resp = await fetch(this.CLOUDINARY_URL, {
          method: 'POST',
          body: formData
        });
        const body = await resp.json();
        this.registerData.drivinglicense = body.secure_url;
        this.drivingLicensePreview = body.secure_url; // Thêm dòng này
        this.message = 'Upload ảnh bằng lái thành công!';
      } catch (err) {
        console.error('Lỗi upload ảnh:', err);
        this.message = 'Có lỗi xảy ra khi upload ảnh bằng lái.';
      } finally {
        this.isUploading = false;
      }
    }
  }

  async handleRegister() {
    try {
      // Validation
      if (!this.registerData.name || !this.registerData.dateofbirth || !this.registerData.nationalidno ||
        !this.registerData.email || !this.registerData.phoneno || !this.selectedProvince ||
        !this.selectedDistrict || !this.selectedWard || !this.registerData.street ||
        !this.registerData.drivinglicense || !this.registerData.password) {
        this.message = 'Vui lòng điền đầy đủ tất cả các trường bắt buộc, bao gồm ảnh bằng lái.';
        return;
      }

      // Kiểm tra tuổi >= 18
      const dob = new Date(this.registerData.dateofbirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        this.message = 'Bạn phải đủ 18 tuổi trở lên để đăng ký.';
        return;
      }



      // Kết hợp các trường thành address
      const provinceName = this.provinces.find(p => String(p.code) === String(this.selectedProvince))?.name || '';
      const districtName = this.districts.find(d => String(d.code) === String(this.selectedDistrict))?.name || '';
      const wardName = this.wards.find(w => String(w.code) === String(this.selectedWard))?.name || '';
      this.registerData.address = `${this.registerData.street}, ${wardName}, ${districtName}, ${provinceName}`;

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
      Swal.fire({
        title: 'Lỗi',
        text: err.error.message || 'Lỗi',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Huỷ',
        customClass: {
          popup: 'my-swal-popup',
          confirmButton: 'my-swal-confirm-btn',
          cancelButton: 'my-swal-cancel-btn'
        },
        buttonsStyling: false
      })
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}