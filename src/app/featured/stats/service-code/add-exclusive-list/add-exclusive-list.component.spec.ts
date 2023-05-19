import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExclusiveListComponent } from './add-exclusive-list.component';

describe('AddExclusiveListComponent', () => {
  let component: AddExclusiveListComponent;
  let fixture: ComponentFixture<AddExclusiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExclusiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExclusiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
