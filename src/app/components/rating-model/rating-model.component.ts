import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-model',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './rating-model.component.html',
  styleUrls: ['./rating-model.component.css']
})
export class RatingModelComponent {
  @Input() bookingId!: number;
  @Output() close = new EventEmitter<void>();

  rate = 0;
  content = '';

  constructor(private http: HttpClient, private router: Router) {}

  handleStarClick(index: number) {
    this.rate = index + 1;
  }

  handleSendReview() {
    const feedbackData = { rate: this.rate, content: this.content };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    });

    this.http
      .post(`http://localhost:8080/add_feedback/${this.bookingId}`, feedbackData, { headers })
      .subscribe({
        next: () => {
          this.close.emit();
          this.router.navigate(['/customer']);
        },
        error: () => alert('Failed to submit the review. Please try again.')
      });
  }
}
