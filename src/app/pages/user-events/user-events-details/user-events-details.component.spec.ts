import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsDetailsComponent } from './user-events-details.component';

describe('UserEventsDetailsComponent', () => {
  let component: UserEventsDetailsComponent;
  let fixture: ComponentFixture<UserEventsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
