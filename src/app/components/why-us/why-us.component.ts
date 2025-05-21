import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Section {
  icon: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.css']
})
export class WhyUsComponent {
  @Input() sections: Section[] = [];
}
