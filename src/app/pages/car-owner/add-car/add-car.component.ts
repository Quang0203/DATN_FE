import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NavbarOwnerComponent } from '../../../components/navbar-owner/navbar-owner.component';
import { BenefitsSectionComponent } from '../../../components/benefits-section/benefits-section.component';
import { FooterComponent } from '../../../components/footer/footer.component';

import { ProfileService } from '../../../services/profile/profile.service';
import { CarService } from '../../../services/car/car.service';

interface TermOfUse { noSmoking: boolean; noPet: boolean; noFoodInCar: boolean; other: boolean; }
interface AdditionalFunctions { bluetooth: boolean; gps: boolean; camera: boolean; sunroof: boolean; childLock: boolean; childSeat: boolean; dvd: boolean; usb: boolean; }

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarOwnerComponent,
    FooterComponent
  ],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {
  // user để Navbar
  userName = '';
  role = '';

  // form state
  formData: any = {
    name: '',
    brand: '',
    model: '',
    color: '',
    numberofseats: '',
    productionyears: '',
    tranmissiontype: '',
    fueltype: '',
    mileage: '',
    fuelconsumption: '',
    baseprice: '',
    deposite: '',
    address: '',
    descripton: '',
    images: '',
    status: 'Available'
  };

  termOfUse: TermOfUse = { noSmoking: false, noPet: false, noFoodInCar: false, other: false };
  additionalFunctions: AdditionalFunctions = { bluetooth: false, gps: false, camera: false, sunroof: false, childLock: false, childSeat: false, dvd: false, usb: false };

  preview: string|null = null;
  loading = false;
  res = '';

  // Cloudinary config
  readonly CLOUD_NAME = 'quangkedo'; // tên Cloudinary của bạn
  readonly UPLOAD_PRESET = 'datnupload'; // tên upload preset của bạn

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: number | null = null;
  selectedDistrict: number | null = null;
  selectedWard: number | null = null;

  constructor(
    private profileSvc: ProfileService,
    private carSvc: CarService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.profileSvc.getProfile().subscribe({
      next: u => {
        this.userName = u.name;
        this.role = (u as any).role;
      },
      error: () => {}
    });

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
    this.formData.district = '';
    this.formData.ward = '';

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
    this.formData.ward = '';

    this.http.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`).subscribe({
      next: (data: any) => {
        console.log('Dữ liệu xã/phường:', data.wards);
        this.wards = data.wards;
      },
      error: err => console.error('Lỗi khi lấy danh sách xã/phường:', err)
    });
  }

  onWardChange(wardId: number | null) {
    if (!wardId) return;
    this.selectedWard = wardId;
    console.log('Selected Ward ID:', this.selectedWard);
  }

  // preview ảnh
  onImageChange(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(file);
    // đồng thời lưu file để upload
    (this.formData as any)._file = file;
  }

  // helper chuyển termOfUse -> chuỗi
  private serializeTerm(): string {
    return [
      this.termOfUse.noSmoking && 'No Smoking',
      this.termOfUse.noPet && 'No Pet',
      this.termOfUse.noFoodInCar && 'No Food In Car',
      this.termOfUse.other && 'Other'
    ].filter(x=>x).join(', ');
  }

  private serializeAdditional(): string {
    return [
      this.additionalFunctions.bluetooth && 'Bluetooth',
      this.additionalFunctions.gps && 'GPS',
      this.additionalFunctions.camera && 'Camera',
      this.additionalFunctions.sunroof && 'Sunroof',
      this.additionalFunctions.childLock && 'ChildLock',
      this.additionalFunctions.childSeat && 'ChildSeat',
      this.additionalFunctions.dvd && 'DVD',
      this.additionalFunctions.usb && 'USB'
    ].filter(x=>x).join(', ');
  }

  // upload lên Cloudinary, trả về URL
  private async uploadImage(): Promise<string|null> {
    const file = (this.formData as any)._file;
    if (!file) return null;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', this.UPLOAD_PRESET);
    data.append('folder', 'Car-Images');

    this.loading = true;
    try {
      const resp = await fetch(`https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data
      });
      const body = await resp.json();
      return body.secure_url;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      this.loading = false;
    }
  }

  // submit form
  async onSubmit(f: NgForm) {
    if (f.invalid) return;

    // Kết hợp các trường thành địa chỉ
    const provinceName = this.provinces.find(p => String(p.code) === String(this.selectedProvince))?.name || '';
    const districtName = this.districts.find(d => String(d.code) === String(this.selectedDistrict))?.name || '';
    const wardName = this.wards.find(w => String(w.code) === String(this.selectedWard))?.name || '';
    this.formData.address = `${this.formData.street}, ${wardName}, ${districtName}, ${provinceName}`;
    console.log('Địa chỉ:', this.formData.address);

    // 1) upload ảnh
    const url = await this.uploadImage();
    if (!url) {
      this.res = 'Lỗi khi tải ảnh lên';
      return;
    }
    this.formData.images = url;

    // 2) create car
    this.carSvc.addCar(this.formData).subscribe({
      next: async result => {
        const idcar = result.result.idcar;

        // 3) thêm term & function
        await this.carSvc.addTerm(idcar, this.serializeTerm()).toPromise();
        await this.carSvc.addFunction(idcar, this.serializeAdditional()).toPromise();

        // 4) chuyển về mycar
        this.router.navigate(['/car-owner/mycar']);
      },
      error: () => {
        this.res = 'Thêm xe thất bại';
      }
    });
  }
}
