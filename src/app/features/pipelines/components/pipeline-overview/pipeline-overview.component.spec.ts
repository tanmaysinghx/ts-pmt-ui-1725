import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineOverviewComponent } from './pipeline-overview.component';

describe('PipelineOverviewComponent', () => {
  let component: PipelineOverviewComponent;
  let fixture: ComponentFixture<PipelineOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
