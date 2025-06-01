import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineContribsComponent } from './line-contribs.component';

describe('LineContribsComponent', () => {
  let component: LineContribsComponent;
  let fixture: ComponentFixture<LineContribsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineContribsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineContribsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
