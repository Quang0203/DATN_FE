import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking/booking.service';
import { EditBookingDetailsRequest } from '../../interfaces';

@Component({
  selector: 'app-edit-booking-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-booking-details.component.html',
  styleUrls: ['./edit-booking-details.component.css']
})
export class EditBookingDetailsComponent implements OnInit {
  bookingDetails: EditBookingDetailsRequest = {
    bookingno: '',
    startdatetime: '',
    enddatetime: '',
    driversinformation: '',
    paymentmethod: '',
    status: '',
    carIdcar: 0,
    carIdcarowner: 0,
    userIduser: 0
  };

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadBookingDetails();
    }
  }

  loadBookingDetails() {
    this.bookingService.getBookingById(this.id).subscribe({
      next: booking => this.bookingDetails = booking,
      error: err => console.error('Error fetching booking details:', err)
    });
  }

  handleSubmit() {
    this.bookingService.updateBooking(this.id, this.bookingDetails).subscribe({
      next: () => this.router.navigate(['/view-booking-list']),
      error: err => console.error('Error updating booking:', err)
    });
  }
}
