// src/app/pages/search-car-results/search-car-results.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { CarService } from '../../services/car/car.service';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileData, SearchCarNewRequest, SearchCarResponse } from '../../interfaces';

@Component({
  selector: 'app-search-car-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    NavbarOwnerComponent,
    FooterComponent
  ],
  templateUrl: './search-car-results.component.html',
  styleUrls: ['./search-car-results.component.css']
})
export class SearchCarResultsComponent implements OnInit {
  results: SearchCarResponse[] = [];
  address = '';
  startDateTime = '';
  endDateTime = '';
  userName = '';
  role = '';

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private profileService: ProfileService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Lấy query params
    this.route.queryParamMap.subscribe(params => {
      this.address = params.get('address') || '';
      this.startDateTime = params.get('startDateTime') || '';
      this.endDateTime = params.get('endDateTime') || '';

      this.loadUserInfo();
      // if (this.address) {
      //   this.searchCars();
      // }
      if (this.address && this.startDateTime && this.endDateTime) {
        this.searchCars();
      } else {
        console.warn('Chưa đủ params để search:', {
          address: this.address,
          start: this.startDateTime,
          end: this.endDateTime
        });
      }
    });
  }

  private loadUserInfo() {
    this.profileService.getProfile().subscribe({
      next: (user: ProfileData) => {
        this.userName = user.name;
        this.role = user.role as any;
      },
      error: () => { }
    });
  }

  private searchCars() {
    console.log('Searching cars with address:', this.address, 'from', this.startDateTime, 'to', this.endDateTime);
    // nếu thiếu start/end thì thôi
    if (!this.startDateTime || !this.endDateTime) {
      console.warn('startDateTime hoặc endDateTime rỗng, bỏ qua search.');
      return;
    }
    const req: SearchCarNewRequest = {
      address: this.address,
      startDateTime: new Date(this.startDateTime).toISOString(),
      endDateTime: new Date(this.endDateTime).toISOString()
    };
    this.carService.searchCarNew(req).subscribe({
      next: data => {
        this.results = data;
        console.log('Search results:', this.results);
      },
      error: err => console.error('Error fetching cars:', err)
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/view-car', id]);
  }

  rentNow(id: number) {
    this.router.navigate(['/customer/booking'], { queryParams: { idCar: id } });
  }
}
