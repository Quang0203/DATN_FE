import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-benefits-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits-section.component.html',
  styleUrls: ['./benefits-section.component.css']
})
export class BenefitsSectionComponent {
  benefits = [
    {
      icon: '/icon/insurance-icon.png',
      alt: 'Insurance Icon',
      title: 'Cách thức bảo hiểm hoạt động',
      description: 'Từ phút bạn giao chìa khóa...'
    },
    {
      icon: '/icon/free-icon.png',
      alt: 'Free Icon',
      title: 'Hoàn toàn miễn phí',
      description: 'Chúng tôi cung cấp đăng ký miễn phí cho cả chủ xe và người thuê...'
    },
    {
      icon: '/icon/price-icon.png',
      alt: 'Price Icon',
      title: 'Bạn quyết định giá cả',
      description: 'Khi bạn đăng xe, bạn quyết định giá cả...'
    },
    {
      icon: '/icon/handover-icon.png',
      alt: 'Handover Icon',
      title: 'Bàn giao phương tiện của bạn',
      description: 'Bạn sắp xếp thời gian và địa điểm để trao đổi...'
    },
    {
      icon: '/icon/control-icon.png',
      alt: 'Control Icon',
      title: 'Bạn làm chủ',
      description: 'Tất cả người thuê đều được chúng tôi sàng lọc trước...'
    },
    {
      icon: '/icon/payment-icon.png',
      alt: 'Payment Icon',
      title: 'Thiết lập thanh toán',
      description: 'Chúng tôi thanh toán cho bạn mỗi tháng một lần...'
    }
  ];
}
