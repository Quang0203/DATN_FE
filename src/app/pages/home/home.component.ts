import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Import các standalone component bạn đã chuyển sang Angular:
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { WhyUsComponent } from '../../components/why-us/why-us.component';
import { PeopleSayComponent } from '../../components/people-say/people-say.component';
import { FindUsComponent } from '../../components/find-us/find-us.component';
import { FooterComponent } from '../../components/footer/footer.component';

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

interface Section {
  icon: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    BannerComponent,
    WhyUsComponent,
    PeopleSayComponent,
    FindUsComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCarData();
    this.fetchFeedbackData();
  }

  fetchCarData() {
    this.http.get<any>('http://localhost:8080/viewHomepage/getCity').subscribe({
      next: (res) => {
        this.carData = res.result;
      },
      error: (err) => console.error('Error fetching car data:', err)
    });
  }

  fetchFeedbackData() {
    this.http.get<any>('http://localhost:8080/viewHomepage/getFeedback').subscribe({
      next: (res) => {
        this.feedbackData = res.result;
      },
      error: (err) => console.error('Error fetching feedback data:', err)
    });
  }
}
