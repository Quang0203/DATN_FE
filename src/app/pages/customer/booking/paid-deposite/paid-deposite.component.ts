import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarOwnerComponent } from '../../../../components/navbar-owner/navbar-owner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location }    from '@angular/common';

@Component({
  selector: 'app-paid-deposite',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NavbarOwnerComponent],
  templateUrl: './paid-deposite.component.html',
  styleUrls: ['./paid-deposite.component.css']
})
export class PaidDepositeComponent implements OnInit {
  booking: any = null;
  user: any = null;
  wallet: number = 0;
  error = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public location: Location,
    public router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken') || '';
    const id = this.route.snapshot.paramMap.get('idbooking');
    // fetch booking
    this.http.get<any>(`http://localhost:8080/getbooking/${id}`, { headers: { Authorization: `Bearer ${token}` } }).subscribe(r => this.booking = r.result);
    // fetch user
    this.http.get<any>('http://localhost:8080/user/myInfo', { headers: { Authorization: `Bearer ${token}` } }).subscribe(r => {
      this.user = r.result;
      this.wallet = r.result.wallet;
    });
  }

  onSubmit(form: any) {
    const token = localStorage.getItem('authToken') || '';
    const id = this.route.snapshot.paramMap.get('idbooking');
    this.http.post<any>(`http://localhost:8080/paidDeposid/${id}`, form.value, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
      next: _ => this.router.navigate([`/confirm-pickup/${id}`]),
      error: () => this.error = 'Có lỗi xảy ra'
    });
  }
}
