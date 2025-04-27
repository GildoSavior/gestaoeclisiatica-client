import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLandingComponent } from './client-landing.component';

describe('ClientLandingComponent', () => {
  let component: ClientLandingComponent;
  let fixture: ComponentFixture<ClientLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
