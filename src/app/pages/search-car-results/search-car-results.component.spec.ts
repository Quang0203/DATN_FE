import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCarResultsComponent } from './search-car-results.component';

describe('SearchCarResultsComponent', () => {
  let component: SearchCarResultsComponent;
  let fixture: ComponentFixture<SearchCarResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCarResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCarResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
