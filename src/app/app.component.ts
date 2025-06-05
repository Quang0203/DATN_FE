import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,  // Nếu bạn sử dụng Angular standalone
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Lưu ý: dùng "styleUrls", không phải "styleUrl"
})
export class AppComponent {
  title = 'rental-car-fe';
}
