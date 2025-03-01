import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoLoginComponent } from './tpo-login.component';

describe('TpoLoginComponent', () => {
  let component: TpoLoginComponent;
  let fixture: ComponentFixture<TpoLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TpoLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
