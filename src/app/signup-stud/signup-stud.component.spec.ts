import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupStudComponent } from './signup-stud.component';

describe('SignupStudComponent', () => {
  let component: SignupStudComponent;
  let fixture: ComponentFixture<SignupStudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupStudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupStudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
