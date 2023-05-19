import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsisdnTrackingComponent } from './msisdn-tracking.component';

describe('MsisdnTrackingComponent', () => {
  let component: MsisdnTrackingComponent;
  let fixture: ComponentFixture<MsisdnTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsisdnTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsisdnTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
