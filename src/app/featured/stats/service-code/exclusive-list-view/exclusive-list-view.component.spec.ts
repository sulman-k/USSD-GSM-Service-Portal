import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveListViewComponent } from './exclusive-list-view.component';

describe('ExclusiveListViewComponent', () => {
  let component: ExclusiveListViewComponent;
  let fixture: ComponentFixture<ExclusiveListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExclusiveListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
