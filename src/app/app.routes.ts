import { Routes } from '@angular/router';

// Trang chủ
import { HomeComponent } from './pages/home/home.component';

// Auth
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/forget-password/reset-password/reset-password.component';

// Người dùng chung
import { ProfileComponent } from './pages/profile/profile.component';

// Car search
import { SearchCarComponent } from './pages/search-car/search-car.component';
import { SearchCarResultsComponent } from './pages/search-car-results/search-car-results.component';
import { ViewCarDetailsComponent } from './pages/view-car-details/view-car-details.component';

// Booking (khách)
import { ViewBookingListComponent } from './pages/view-booking-list/view-booking-list.component';
import { EditBookingDetailsComponent } from './pages/edit-booking-details/edit-booking-details.component';
import { ReturnCarComponent } from './pages/return-car/return-car.component';
import { ReturnUrlComponent } from './pages/return-url/return-url.component';

// Wallet & Feedback Report
import { ViewWalletComponent } from './pages/view-wallet/view-wallet.component';
import { ViewFeedbackReportComponent } from './pages/view-feedback-report/view-feedback-report.component';

// Customer-specific
import { CustomerComponent } from './pages/customer/customer.component';
import { BookingComponent as CustomerBookingComponent } from './pages/customer/booking/booking.component';
import { BookComponent } from './pages/customer/booking/book/book.component';
import { PaidDepositeComponent } from './pages/customer/booking/paid-deposite/paid-deposite.component';
import { FeedbackComponent as CustomerFeedbackComponent } from './pages/customer/feedback/feedback.component';

// // Confirm pickup & complete (chung)
// import { ConfirmPickupComponent } from './pages/confirmpickup/confirm-pickup.component';
import { CompleteComponent } from './pages/complete/complete.component';
import { CarOwnerComponent } from './pages/car-owner/car-owner.component';
import { AddCarComponent } from './pages/car-owner/add-car/add-car.component';
import { MybookingComponent } from './pages/car-owner/mybooking/mybooking.component';
import { BookingComponent } from './pages/car-owner/mybooking/booking/booking.component';
import { MycarComponent } from './pages/car-owner/mycar/mycar.component';
import { CarComponent } from './pages/car-owner/mycar/car/car.component';
import { CarDetailComponent } from './pages/car-owner/mycar/car-detail/car-detail.component';
import { ConfirmPickupComponent } from './pages/confirm-pickup/confirm-pickup.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';

export const routes: Routes = [
  // Home
  { path: '', component: HomeComponent },
  { path: 'aboutus', component: AboutUsComponent },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  // { path: 'forget-password/reset-password/:email', component: ResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },


  // Profile
  { path: 'profile', component: ProfileComponent },

  // Car search & details
  { path: 'search-car', component: SearchCarComponent },
  { path: 'search-car-results', component: SearchCarResultsComponent },
  { path: 'view-car/:idcar', component: ViewCarDetailsComponent },

  // Booking (khách)
  { path: 'view-booking-list', component: ViewBookingListComponent },
  { path: 'edit-booking/:id', component: EditBookingDetailsComponent },
  { path: 'return-car/:idbooking', component: ReturnCarComponent },
  { path: 'return-url', component: ReturnUrlComponent },

  // Wallet & Feedback report
  { path: 'view-wallet', component: ViewWalletComponent },
  { path: 'view-feedback-report', component: ViewFeedbackReportComponent },

  // Customer-specific
  { path: 'customer', component: CustomerComponent },
  { path: 'customer/booking', component: CustomerBookingComponent },
  { path: 'customer/booking/book/:idbooking', component: BookComponent },
  { path: 'customer/booking/paid-deposite/:idbooking', component: PaidDepositeComponent },
  { path: 'customer/feedback/:idbooking', component: CustomerFeedbackComponent },

  // Car owner home
  { path: 'car-owner', component: CarOwnerComponent },

  // Add Car
  { path: 'car-owner/add-car', component: AddCarComponent },

  // My Booking (car owner)
  { path: 'car-owner/mybooking', component: MybookingComponent },
  // Chi tiết 1 booking (nếu có route con)
  { path: 'car-owner/mybooking/booking/:idbooking', component: BookingComponent },

  // My Car (car owner)
  { path: 'car-owner/mycar', component: MycarComponent },
  // Chi tiết từng car
  { path: 'car-owner/mycar/car/:idcar', component: CarComponent },
  { path: 'car-owner/mycar/car-detail/:idcar', component: CarDetailComponent },

//   // Confirm pick‑up & complete (chung)
  { path: 'confirmpickup/:idbooking', component: ConfirmPickupComponent },
  { path: 'complete/:idbooking', component: CompleteComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];
