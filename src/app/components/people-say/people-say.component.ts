import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeedbackData {
  user?: { name: string };
  UserName?: string;
  content?: string;
  FeedbackContent?: string;
  rate?: number;
  Rating?: number;
  datetime?: string;
  Date?: string;
}

@Component({
  selector: 'app-people-say',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-say.component.html',
  styleUrls: ['./people-say.component.css']
})
export class PeopleSayComponent {
  @Input() feedbackData: FeedbackData[] = [];
}
