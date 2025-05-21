import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    ReactiveFormsModule
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
      address: ['', Validators.required],
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

    this.carService.getCarDetails(this.idcar).subscribe(res => {
      this.carForm.patchValue(res.car);
      this.preview = res.car.images;
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

  async onSubmit() {
    if (this.carForm.invalid) return;
    this.loading = true;
    let formValue: any = this.carForm.value;

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