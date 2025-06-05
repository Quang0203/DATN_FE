import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidDepositeComponent } from './paid-deposite.component';

describe('PaidDepositeComponent', () => {
  let component: PaidDepositeComponent;
  let fixture: ComponentFixture<PaidDepositeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidDepositeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidDepositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
