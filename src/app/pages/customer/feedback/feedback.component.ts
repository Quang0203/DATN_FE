import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarOwnerComponent } from '../../../components/navbar-owner/navbar-owner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule,
    FormsModule, NavbarOwnerComponent],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  booking: any = null;
  comment = '';
  rate = 5;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken') || '';
    const id = this.route.snapshot.paramMap.get('idbooking');
    this.http.get<any>(`http://localhost:8080/getbooking/${id}`, { headers: { Authorization: `Bearer ${token}` } }).subscribe(r => this.booking = r.result);
  }

  onSubmit() {
    const token = localStorage.getItem('authToken') || '';
    const id = this.route.snapshot.paramMap.get('idbooking');
    this.http.post<any>(`http://localhost:8080/feedback/${id}`, { rate: this.rate, content: this.comment }, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
      next: _ => this.router.navigate(['/view-booking-list']),
      error: err => console.error(err)
    });
  }
}
