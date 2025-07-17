import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTicketsComponent } from './search-tickets.component';

describe('SearchTicketsComponent', () => {
  let component: SearchTicketsComponent;
  let fixture: ComponentFixture<SearchTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
