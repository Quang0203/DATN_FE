import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbackReportComponent } from './view-feedback-report.component';

describe('ViewFeedbackReportComponent', () => {
  let component: ViewFeedbackReportComponent;
  let fixture: ComponentFixture<ViewFeedbackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFeedbackReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFeedbackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
