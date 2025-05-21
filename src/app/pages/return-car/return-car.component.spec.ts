import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnCarComponent } from './return-car.component';

describe('ReturnCarComponent', () => {
  let component: ReturnCarComponent;
  let fixture: ComponentFixture<ReturnCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnCarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
