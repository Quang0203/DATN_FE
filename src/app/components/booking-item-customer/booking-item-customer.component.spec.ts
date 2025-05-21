import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingItemCustomerComponent } from './booking-item-customer.component';

describe('BookingItemCustomerComponent', () => {
  let component: BookingItemCustomerComponent;
  let fixture: ComponentFixture<BookingItemCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingItemCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingItemCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
