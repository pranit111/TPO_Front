import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoSearchComponent } from './tpo-search.component';

describe('TpoSearchComponent', () => {
  let component: TpoSearchComponent;
  let fixture: ComponentFixture<TpoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TpoSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
