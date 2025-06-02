import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPreloginComponent } from './layout-prelogin.component';

describe('LayoutPreloginComponent', () => {
  let component: LayoutPreloginComponent;
  let fixture: ComponentFixture<LayoutPreloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPreloginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutPreloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
