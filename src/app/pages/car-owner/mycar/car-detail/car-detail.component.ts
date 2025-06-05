import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Car } from '../../../../interfaces';
import { CarService } from '../../../../services/car/car.service';
import { NavbarOwnerComponent } from '../../../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { ProfileService } from '../../../../services/profile/profile.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [
    NavbarOwnerComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {
  carForm!: FormGroup;
  idcar!: number;
  preview: string | ArrayBuffer | null = null;
  loading = false;
  message = '';
  userName = '';
  role = '';

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: number | null = null;
  selectedDistrict: number | null = null;
  selectedWard: number | null = null;
  street: string = '';

  // Ánh xạ nhãn tiếng Việt cho các trường
  labelMap: { [key: string]: string } = {
    name: 'Tên xe',
    brand: 'Hãng xe',
    model: 'Mẫu xe',
    color: 'Màu sắc',
    numberofseats: 'Số ghế',
    productionyears: 'Năm sản xuất',
    tranmissiontype: 'Loại hộp số',
    fueltype: 'Loại nhiên liệu',
    mileage: 'Số km đã đi',
    fuelconsumption: 'Mức tiêu thụ nhiên liệu (L/100km)',
    baseprice: 'Giá cơ bản',
    deposite: 'Tiền cọc',
    address: 'Địa chỉ',
    descripton: 'Mô tả',
    images: 'Ảnh'
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private carService: CarService,
    private profileSvc: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idcar = Number(this.route.snapshot.paramMap.get('idcar'));
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      numberofseats: ['', Validators.required],
      productionyears: ['', Validators.required],
      tranmissiontype: ['', Validators.required],
      fueltype: ['', Validators.required],
      mileage: ['', Validators.required],
      fuelconsumption: ['', Validators.required],
      baseprice: ['', Validators.required],
      deposite: ['', Validators.required],
      descripton: ['', Validators.required],
      images: [''],
      status: ['Available', Validators.required]
    });

    this.profileSvc.getProfile().subscribe({
      next: user => {
        this.userName = user.name;
        this.role = (user as any).role;
      },
      error: err => console.error(err)
    });

    // Lấy danh sách tỉnh
    this.fetchProvinces();

    this.carService.getCarDetails(this.idcar).subscribe(res => {
      // Tách địa chỉ thành 4 trường
      const address = res.car.address || '';
      const parts = address.split(',');
      this.street = parts[0]?.trim() || '';
      const wardName = parts[1]?.trim() || '';
      const districtName = parts[2]?.trim() || '';
      const provinceName = parts[3]?.trim() || '';

      // Set lại các trường địa chỉ
      this.carForm.patchValue(res.car);
      this.preview = res.car.images;

      // Tìm code theo tên cho các dropdown
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedWard = null;

      // Tìm code tỉnh
      this.fetchProvinces().then(() => {
        const province = this.provinces.find(p => p.name === provinceName);
        if (province) {
          this.selectedProvince = province.code;
          this.onProvinceChange(province.code, districtName, wardName);
        }
      });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result;
    reader.readAsDataURL(file);
    this.carForm.patchValue({ images: file });
  }

  fetchProvinces(): Promise<void> {
    return new Promise((resolve) => {
      fetch('https://provinces.open-api.vn/api/p')
        .then(res => res.json())
        .then(data => {
          this.provinces = data;
          resolve();
        });
    });
  }

  onProvinceChange(provinceCode: number, districtNameFromDb?: string, wardNameFromDb?: string) {
    this.selectedProvince = provinceCode;
    this.districts = [];
    this.wards = [];
    this.selectedDistrict = null;
    this.selectedWard = null;
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        this.districts = data.districts;
        if (districtNameFromDb) {
          const district = this.districts.find((d: any) => d.name === districtNameFromDb);
          if (district) {
            this.selectedDistrict = district.code;
            this.onDistrictChange(district.code, wardNameFromDb);
          }
        }
      });
  }

  onDistrictChange(districtCode: number, wardNameFromDb?: string) {
    this.selectedDistrict = districtCode;
    this.wards = [];
    this.selectedWard = null;
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        this.wards = data.wards;
        if (wardNameFromDb) {
          const ward = this.wards.find((w: any) => w.name === wardNameFromDb);
          if (ward) {
            this.selectedWard = ward.code;
          }
        }
      });
  }

  onWardChange(wardCode: number) {
    this.selectedWard = wardCode;
  }

  async onSubmit() {
    if (this.carForm.invalid) return;
    this.loading = true;
    let formValue: any = this.carForm.value;

    // Ghép lại địa chỉ
    const provinceName = this.provinces.find(p => String(p.code) === String(this.selectedProvince))?.name || '';
    const districtName = this.districts.find(d => String(d.code) === String(this.selectedDistrict))?.name || '';
    const wardName = this.wards.find(w => String(w.code) === String(this.selectedWard))?.name || '';
    formValue.address = `${this.street}, ${wardName}, ${districtName}, ${provinceName}`;

    // Xử lý ảnh như cũ
    if (formValue.images instanceof File) {
      const data = new FormData();
      data.append('file', formValue.images);
      data.append('upload_preset', 'datnupload');
      data.append('folder', 'Car-Images');
      const cloud: any = await fetch(
        'https://api.cloudinary.com/v1_1/quangkedo/image/upload',
        { method: 'POST', body: data }
      ).then(r => r.json());
      formValue.images = cloud.secure_url;
    }

    this.carService.editCar(this.idcar, formValue).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/car-owner/mycar']);
      },
      error: () => {
        this.loading = false;
        this.message = 'Sửa thất bại, thử lại sau';
      }
    });
  }
}