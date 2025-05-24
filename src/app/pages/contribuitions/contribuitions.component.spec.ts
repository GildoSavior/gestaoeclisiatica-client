import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuitionsComponent } from './contribuitions.component';

describe('ContribuitionsComponent', () => {
  let component: ContribuitionsComponent;
  let fixture: ComponentFixture<ContribuitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribuitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContribuitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
