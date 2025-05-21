import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule }  from '@angular/router';

import { CarComponent }             from './car/car.component';

import { CarService }   from '../../../services/car/car.service';

import { Car as CarModel } from '../../../interfaces';
import { NavbarOwnerComponent } from '../../../components/navbar-owner/navbar-owner.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-mycar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarOwnerComponent,
    CarComponent,
    FooterComponent
  ],
  templateUrl: './mycar.component.html',
  styleUrls: ['./mycar.component.css']
})
export class MycarComponent implements OnInit {
  cars: CarModel[] = [];
  userName = '';
  role     = '';

  constructor(
    private carSvc:  CarService,
    private profileSvc: ProfileService
  ) {}

  ngOnInit() {
    // 1. Lấy user
    this.profileSvc.getProfile().subscribe({
      next: user => {
        this.userName = user.name;
        this.role = (user as any).role;
      },
      error: err => console.error(err)
    });

    // 2. Lấy list Cars
    this.carSvc.getMyCars()
      .subscribe(list => this.cars = list);
  }
}
