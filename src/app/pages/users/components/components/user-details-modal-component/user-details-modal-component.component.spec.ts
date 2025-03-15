import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsModalComponentComponent } from './user-details-modal-component.component';

describe('UserDetailsModalComponentComponent', () => {
  let component: UserDetailsModalComponentComponent;
  let fixture: ComponentFixture<UserDetailsModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailsModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
