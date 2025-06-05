import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProfileService } from '../../services/profile/profile.service';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { FeedbackResponse } from '../../interfaces';

import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-view-feedback-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarOwnerComponent,
    FooterComponent
  ],
  templateUrl: './view-feedback-report.component.html',
  styleUrls: ['./view-feedback-report.component.css']
})
export class ViewFeedbackReportComponent implements OnInit {
  feedbacks: FeedbackResponse[] = [];
  error = '';
  userName = '';
  role = '';
  averageRating = 0;
  selectedRate: number | null = null;

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private profileSvc: ProfileService,
    private feedbackSvc: FeedbackService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.profileSvc.getProfile().subscribe({
      next: user => {
        this.userName = user.name;
        this.role = (user as any).role;
      },
      error: err => console.error('Error fetching user:', err)
    });

    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackSvc.getFeedbackReport(this.selectedRate ?? undefined).subscribe({
      next: feedbacks => {
        this.feedbacks = feedbacks;
      },
      error: err => this.error = 'Error fetching feedback report'
    });

    this.feedbackSvc.getAverageRating().subscribe({
      next: avg => this.averageRating = avg,
      error: err => console.error('Error fetching average rating:', err)
    });
  }

  selectRate(rate: number | null) {
    this.selectedRate = rate;
    this.loadFeedbacks();
  }

  renderStars(rate: number): string[] {
    return Array.from({ length: 5 }, (_, index) => (index < rate ? 'gold' : '#ccc'));
  }

  round(value: number): number {
    return Math.round(value);
  }
  
}
