import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSayCustomerComponent } from './people-say-customer.component';

describe('PeopleSayCustomerComponent', () => {
  let component: PeopleSayCustomerComponent;
  let fixture: ComponentFixture<PeopleSayCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleSayCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleSayCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
