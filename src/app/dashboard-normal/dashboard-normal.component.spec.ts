import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNormalComponent } from './dashboard-normal.component';

describe('DashboardNormalComponent', () => {
  let component: DashboardNormalComponent;
  let fixture: ComponentFixture<DashboardNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
