import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineContribuitionsDetailsComponent } from './line-contribuitions-details.component';

describe('LineContribuitionsDetailsComponent', () => {
  let component: LineContribuitionsDetailsComponent;
  let fixture: ComponentFixture<LineContribuitionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineContribuitionsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineContribuitionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
