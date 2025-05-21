import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingModelComponent } from './rating-model.component';

describe('RatingModelComponent', () => {
  let component: RatingModelComponent;
  let fixture: ComponentFixture<RatingModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
