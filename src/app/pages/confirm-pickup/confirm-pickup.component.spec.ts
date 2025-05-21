import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPickupComponent } from './confirm-pickup.component';

describe('ConfirmPickupComponent', () => {
  let component: ConfirmPickupComponent;
  let fixture: ComponentFixture<ConfirmPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPickupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
