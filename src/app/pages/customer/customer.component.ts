// src/app/pages/customer/customer.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { SearchCarComponent } from '../../pages/search-car/search-car.component';
import { ListCarComponent } from '../../components/list-car/list-car.component';
import { WhyUsComponent } from '../../components/why-us/why-us.component';
import { PeopleSayCustomerComponent } from '../../components/people-say-customer/people-say-customer.component';
import { FindUsCustomerComponent } from '../../components/find-us-customer/find-us-customer.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { Car } from '../../interfaces';

interface CarData {
  address: string;
  car_count: number;
  car_count_rounded: string;
  image: string;
}

interface FeedbackData {
  UserName: string;
  FeedbackContent: string;
  Rating: number;
  Date: string;
}

interface UserInfo {
  name: string;
  role: string;
}

interface Section {
  icon: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarOwnerComponent,
    SearchCarComponent,
    ListCarComponent,
    WhyUsComponent,
    PeopleSayCustomerComponent,
    FindUsCustomerComponent,
    FooterComponent,
    ChatComponent
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  userInfo: UserInfo = { name: '', role: '' };
  listCar: Car[] = [];
  carData: CarData[] = [];
  feedbackData: FeedbackData[] = [];

  sections: Section[] = [
    {
      icon: 'fa-dollar-sign',
      title: 'Tiết kiệm',
      content: 'Chúng tôi không có phí thiết lập hoặc đăng ký. Bạn chỉ bị tính phí khi thuê xe. Vì vậy, hãy bắt đầu MIỄN PHÍ!'
    },
    {
      icon: 'fa-car',
      title: 'Đa dạng',
      content: 'Lựa chọn từ nhiều loại xe có sẵn để thuê với giá cạnh tranh.'
    },
    {
      icon: 'fa-thumbs-up',
      title: 'Tin cậy',
      content: 'Khách hàng tin tưởng chúng tôi luôn cung cấp dịch vụ đáng tin cậy và chất lượng.'
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.fetchUserInfo(token);
      this.fetchListCar(token);
      this.fetchCarData(token);
      this.fetchFeedbackData(token);
    }
  }

  fetchUserInfo(token: string | null) {
    if (token) {
      this.http.get<any>('http://localhost:8080/user/myInfo', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res) => {
          this.userInfo = {
            name: res.result.name,
            role: res.result.role
          };
        },
        error: (err) => console.error('Error fetching user info:', err)
      });
    }
  }

  fetchListCar(token: string | null) {
    this.http.get<any>('http://localhost:8080/getlistcar', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.listCar = res.result
          .filter((car: Car) => car.status !== 'Stopped')
          .map((car: Car) => ({
            ...car,
            images: car.images ?? '' // Đảm bảo images luôn là string
          }));
      },
      error: (err) => console.error('Error fetching car list:', err)
    });
  }

  // customer.component.ts
  fetchCarData(token: string | null) {
    this.http.get<any>('http://localhost:8080/viewhomeCustomer/top-cities', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        // API trả về res.result là Array<[string, number]>
        this.carData = res.result.map((tuple: [string, number]) => {
          const [addressRaw, count] = tuple;
          return {
            address: addressRaw.trim(),
            car_count: count,
            // nếu bạn muốn làm tròn: 
            car_count_rounded: `${Math.floor(count / 10) * 10}+`,
            // dùng một ảnh mặc định (hoặc tuỳ chỉnh tuple[2] nếu API có trả thêm URL)
            image: 'https://placehold.co/600x400?text=' + encodeURIComponent(addressRaw.trim())
          };
        });
      },
      error: (err) => console.error('Error fetching city data:', err)
    });
  }


  fetchFeedbackData(token: string | null) {
    this.http.get<any>('http://localhost:8080/viewhomeCustomer/feedback', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.feedbackData = res.result;
      },
      error: (err) => console.error('Error fetching feedback:', err)
    });
  }
}
