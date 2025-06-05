import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUsCustomerComponent } from './find-us-customer.component';

describe('FindUsCustomerComponent', () => {
  let component: FindUsCustomerComponent;
  let fixture: ComponentFixture<FindUsCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindUsCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindUsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
