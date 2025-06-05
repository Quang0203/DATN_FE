import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-car',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.css']
})
export class SearchCarComponent {
  address: string = '';
  startDateTime: string = '';
  endDateTime: string = '';
  errorMessage = '';
  minDateTime: string = '';
  
  // Hiển thị placeholder cho datetime inputs
  startDateTimeDisplay: string = '';
  endDateTimeDisplay: string = '';
  isStartDateTimeFocused: boolean = false;
  isEndDateTimeFocused: boolean = false;

  constructor(private router: Router) {
    // Thiết lập thời gian tối thiểu là thời điểm hiện tại
    this.setMinDateTime();
  }

  private setMinDateTime(): void {
    const now = new Date();
    // Định dạng datetime-local cần format: YYYY-MM-DDTHH:mm
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  private isDateTimeInPast(dateTimeString: string): boolean {
    if (!dateTimeString) return false;
    const selectedDate = new Date(dateTimeString);
    const now = new Date();
    return selectedDate < now;
  }

  private isEndDateTimeBeforeStartDateTime(): boolean {
    if (!this.startDateTime || !this.endDateTime) return false;
    const startDate = new Date(this.startDateTime);
    const endDate = new Date(this.endDateTime);
    return endDate <= startDate;
  }

  private formatDateTimeForDisplay(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  handleSearch(): void {
    // Reset thông báo
    this.errorMessage = '';

    // Kiểm tra đủ 3 trường
    if (!this.address || !this.startDateTime || !this.endDateTime) {
      this.errorMessage = 'Vui lòng nhập địa điểm, ngày giờ nhận và ngày giờ trả xe.';
      return;
    }

    // Kiểm tra ngày giờ bắt đầu không được trong quá khứ
    if (this.isDateTimeInPast(this.startDateTime)) {
      this.errorMessage = 'Thời gian nhận xe không được chọn trong quá khứ. Vui lòng chọn thời gian hiện tại hoặc tương lai.';
      return;
    }

    // Kiểm tra ngày giờ kết thúc không được trong quá khứ
    if (this.isDateTimeInPast(this.endDateTime)) {
      this.errorMessage = 'Thời gian trả xe không được chọn trong quá khứ. Vui lòng chọn thời gian hiện tại hoặc tương lai.';
      return;
    }

    // Kiểm tra thời gian kết thúc phải lớn hơn thời gian bắt đầu
    if (this.isEndDateTimeBeforeStartDateTime()) {
      this.errorMessage = 'Thời gian trả xe phải lớn hơn thời gian nhận xe. Vui lòng chọn lại.';
      return;
    }

    // Kiểm tra thời gian thuê tối thiểu (ít nhất 1 giờ)
    const startDate = new Date(this.startDateTime);
    const endDate = new Date(this.endDateTime);
    const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      this.errorMessage = 'Thời gian thuê xe phải ít nhất 1 giờ.';
      return;
    }

    const params = new URLSearchParams();
    params.set('address', this.address);
    params.set('startDateTime', this.startDateTime);
    params.set('endDateTime', this.endDateTime);
    this.router.navigateByUrl(`/search-car-results?${params.toString()}`);
  }

  // Xử lý khi focus vào start datetime
  onStartDateTimeFocus(): void {
    this.isStartDateTimeFocused = true;
  }

  // Xử lý khi blur khỏi start datetime
  onStartDateTimeBlur(): void {
    this.isStartDateTimeFocused = false;
    if (this.startDateTime) {
      this.startDateTimeDisplay = this.formatDateTimeForDisplay(this.startDateTime);
    }
  }

  // Phương thức để xử lý khi thay đổi thời gian bắt đầu
  onStartDateTimeChange(): void {
    if (this.startDateTime) {
      this.startDateTimeDisplay = this.formatDateTimeForDisplay(this.startDateTime);
    }

    // Nếu thời gian kết thúc đã được chọn và nhỏ hơn hoặc bằng thời gian bắt đầu mới
    if (this.endDateTime && this.isEndDateTimeBeforeStartDateTime()) {
      // Tự động đặt thời gian kết thúc là 1 giờ sau thời gian bắt đầu
      const startDate = new Date(this.startDateTime);
      startDate.setHours(startDate.getHours() + 1);
      this.endDateTime = startDate.toISOString().slice(0, 16);
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.endDateTime);
    }
    
    // Xóa thông báo lỗi khi người dùng thay đổi
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  // Xử lý khi focus vào end datetime
  onEndDateTimeFocus(): void {
    this.isEndDateTimeFocused = true;
  }

  // Xử lý khi blur khỏi end datetime
  onEndDateTimeBlur(): void {
    this.isEndDateTimeFocused = false;
    if (this.endDateTime) {
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.endDateTime);
    }
  }

  // Phương thức để xử lý khi thay đổi thời gian kết thúc
  onEndDateTimeChange(): void {
    if (this.endDateTime) {
      this.endDateTimeDisplay = this.formatDateTimeForDisplay(this.endDateTime);
    }

    // Xóa thông báo lỗi khi người dùng thay đổi
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  // Xử lý khi click vào display input
  onStartDisplayClick(): void {
  const hiddenInput = document.getElementById('startDateTime') as HTMLInputElement;
  if (hiddenInput) {
    if ('showPicker' in hiddenInput) {
      // Hiện picker nếu trình duyệt hỗ trợ
      (hiddenInput as any).showPicker();
    } else {
      (hiddenInput as HTMLInputElement).focus();
      (hiddenInput as HTMLInputElement).click();
    }
  }
}

onEndDisplayClick(): void {
  const hiddenInput = document.getElementById('endDateTime') as HTMLInputElement;
  if (hiddenInput) {
    if ('showPicker' in hiddenInput) {
      (hiddenInput as any).showPicker();
    } else {
      (hiddenInput as HTMLInputElement).focus();
      (hiddenInput as HTMLInputElement).click();
    }
  }
}
}