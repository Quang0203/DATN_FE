import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar-owner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-owner.component.html',
  styleUrls: ['./navbar-owner.component.css']
})
export class NavbarOwnerComponent implements OnInit, OnDestroy {
  @Input() name!: string;
  @Input() role!: string;
  isDropdownOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isMobile: boolean = false; // Default to false

  private resizeListener = () => this.checkMobile();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  handleHome() {
    if (this.role === 'CAROWNER') this.router.navigate(['/car-owner']);
    else this.router.navigate(['/customer']);
  }

  confirmLogout() {
    Swal.fire({
      title: 'Xác nhận đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Huỷ',
      customClass: {
        popup: 'my-swal-popup',
        confirmButton: 'my-swal-confirm-btn',
        cancelButton: 'my-swal-cancel-btn'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  private logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  goToPage(path: string) {
    this.router.navigate([path]);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isDropdownOpen = false; // Đóng dropdown khi mở mobile menu
  }
}