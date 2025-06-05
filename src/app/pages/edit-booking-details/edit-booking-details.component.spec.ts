import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookingDetailsComponent } from './edit-booking-details.component';

describe('EditBookingDetailsComponent', () => {
  let component: EditBookingDetailsComponent;
  let fixture: ComponentFixture<EditBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBookingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
