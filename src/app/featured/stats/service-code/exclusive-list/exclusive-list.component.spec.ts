import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveListComponent } from './exclusive-list.component';

describe('ExclusiveListComponent', () => {
  let component: ExclusiveListComponent;
  let fixture: ComponentFixture<ExclusiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExclusiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
