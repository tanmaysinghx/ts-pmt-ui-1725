import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineExecutionComponent } from './pipeline-execution.component';

describe('PipelineExecutionComponent', () => {
  let component: PipelineExecutionComponent;
  let fixture: ComponentFixture<PipelineExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineExecutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
