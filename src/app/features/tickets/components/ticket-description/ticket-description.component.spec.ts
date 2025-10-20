import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDescriptionComponent } from './ticket-description.component';

describe('TicketDescriptionComponent', () => {
  let component: TicketDescriptionComponent;
  let fixture: ComponentFixture<TicketDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
