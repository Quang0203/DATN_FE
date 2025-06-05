import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarOwnerComponent } from '../../components/navbar-owner/navbar-owner.component';
import { BenefitsSectionComponent } from '../../components/benefits-section/benefits-section.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-car-owner',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarOwnerComponent,
    BenefitsSectionComponent,
    FooterComponent
  ],
  templateUrl: './car-owner.component.html',
  styleUrls: ['./car-owner.component.css']
})
export class CarOwnerComponent implements OnInit {
  userName = '';
  role = '';

  constructor(
    private profileSvc: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileSvc.getProfile().subscribe({
      next: u => {
        this.userName = u.name;
        this.role = (u as any).role;
      },
      error: () => console.error('Failed to load profile')
    });
  }

  onListCar() {
    this.router.navigate(['/car-owner/mycar']);
  }
}
