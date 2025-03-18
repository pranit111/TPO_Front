import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoNavbarComponent } from './tpo-navbar.component';

describe('TpoNavbarComponent', () => {
  let component: TpoNavbarComponent;
  let fixture: ComponentFixture<TpoNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TpoNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpoNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
