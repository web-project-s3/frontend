import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeachOrdersComponent } from './beach-orders.component';

describe('BeachOrdersComponent', () => {
  let component: BeachOrdersComponent;
  let fixture: ComponentFixture<BeachOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeachOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeachOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
