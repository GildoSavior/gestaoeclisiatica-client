import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuitionsDetailsComponent } from './contribuitions-details.component';

describe('ContribuitionsDetailsComponent', () => {
  let component: ContribuitionsDetailsComponent;
  let fixture: ComponentFixture<ContribuitionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribuitionsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContribuitionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
