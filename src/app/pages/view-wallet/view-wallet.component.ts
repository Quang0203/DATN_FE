import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { WalletService } from '../../services/wallet/wallet.service';
import { ProfileService } from '../../services/profile/profile.service';
import { ViewWalletResponse, TopUpRequest, WithdrawRequest } from '../../interfaces';

@Component({
  selector: 'app-view-wallet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarOwnerComponent,
    FooterComponent
  ],
  templateUrl: './view-wallet.component.html',
  styleUrls: ['./view-wallet.component.css']
})
export class ViewWalletComponent implements OnInit {
  today = new Date();
  wallet: ViewWalletResponse | null = null;
  error = '';
  topUpReq: TopUpRequest = { userId: 0, amount: 2000000 };
  withdrawReq: WithdrawRequest = { userId: 0, amount: 2000000 };
  showTopUp = false;
  showWithdraw = false;

  // lọc theo ngày
  fromDate = '';
  toDate = '';

  // phân trang
  currentPage = 1;
  perPage = 5;

  // user info để hiển thị navbar
  userName = '';
  role = '';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private walletSvc: WalletService,
    private profileSvc: ProfileService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // 1) load user để lấy tên/role
    this.profileSvc.getProfile().subscribe({
      next: u => {
        this.userName = u.name;
        this.role = (u as any).role;
      },
      error: () => {}
    });

    // 2) load wallet
    this.reloadWallet();
  }

  private reloadWallet() {
    this.walletSvc.getWallet().subscribe({
      next: w => {
        // sắp xếp giảm dần
        w.transactions.sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        this.wallet = w;
        // thiết lập userId cho request
        this.topUpReq.userId = w.userId;
        this.withdrawReq.userId = w.userId;
        // reset trang & bộ lọc
        this.currentPage = 1;
        this.fromDate = this.toDate = '';
      },
      error: () => this.error = 'Error fetching wallet details'
    });
  }

  // trang hiện tại slice
  get pagedTransactions() {
    if (!this.wallet) return [];
    const start = (this.currentPage - 1) * this.perPage;
    return this.wallet.transactions.slice(start, start + this.perPage);
  }

  totalPages(): number {
    return this.wallet
      ? Math.ceil(this.wallet.transactions.length / this.perPage)
      : 0;
  }

  paginate(page: number) {
    this.currentPage = page;
  }

  // Top-up
  confirmTopUp() {
    this.walletSvc.topUp(this.topUpReq).subscribe({
      next: () => {
        this.showTopUp = false;
        this.reloadWallet();
      },
      error: () => this.error = 'Error topping up'
    });
  }

  // Withdraw
  confirmWithdraw() {
    this.walletSvc.withdraw(this.withdrawReq).subscribe({
      next: () => {
        this.showWithdraw = false;
        this.reloadWallet();
      },
      error: () => this.error = 'Error withdrawing'
    });
  }

  // lọc ngày
  searchByDate() {
    if (!this.fromDate || !this.toDate) return;
    this.walletSvc.searchTransactions(this.fromDate, this.toDate).subscribe({
      next: w => {
        w.transactions.sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        this.wallet = w;
        this.currentPage = 1;
      },
      error: () => this.error = 'Error filtering transactions'
    });
  }

  resetFilter() {
    this.reloadWallet();
  }
}
