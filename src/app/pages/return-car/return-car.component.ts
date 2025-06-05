import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-car.component.html',
  styleUrls: ['./return-car.component.css']
})
export class ReturnCarComponent implements OnInit {
  booking: any = { result: {} };
  user: any = {};
  car: any = {};
  error: string = '';
  wallet: number = 0;
  idbooking: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.idbooking = Number(this.route.snapshot.paramMap.get('idbooking'));
    this.loadBooking();
    this.loadUser();
  }

  private getHeaders() {
    const token = localStorage.getItem('authToken') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  private loadBooking() {
    this.http.get<any>(`http://localhost:8080/getbooking/${this.idbooking}`, this.getHeaders())
      .subscribe({
        next: res => {
          this.booking = res.result;
          if (this.booking?.carIdcar) {
            this.loadCar(this.booking.carIdcar);
          }
        },
        error: err => console.error(err)
      });
  }

  private loadUser() {
    this.http.get<any>('http://localhost:8080/user/myInfo', this.getHeaders())
      .subscribe({
        next: res => {
          this.user = res.result;
          this.wallet = res.result.wallet;
        },
        error: err => console.error(err)
      });
  }

  private loadCar(carId: number) {
    this.http.get<any>(`http://localhost:8080/getcar/${carId}`, this.getHeaders())
      .subscribe({
        next: res => this.car = res.result,
        error: err => console.error(err)
      });
  }

  handleSubmit() {
    const value = {}; // Có thể mở rộng thêm các input nếu cần sau này
    this.http.post<any>(`http://localhost:8080/returncar/${this.idbooking}`, value, this.getHeaders())
      .subscribe({
        next: res => {
          this.error = res.result.message;
          this.router.navigate(['/complete', this.idbooking]);
        },
        error: err => {
          console.error(err);
          this.error = 'An error occurred during car return';
        }
      });
  }

  goBack() {
    this.router.navigate(['/customer']);  // tùy bạn muốn navigate đi đâu, hoặc location.back() cũng được
  }
}
