import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildParametersModalComponent } from './build-parameters-modal.component';

describe('BuildParametersModalComponent', () => {
  let component: BuildParametersModalComponent;
  let fixture: ComponentFixture<BuildParametersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildParametersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildParametersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
