import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoadminComponent } from './tpoadmin.component';

describe('TpoadminComponent', () => {
  let component: TpoadminComponent;
  let fixture: ComponentFixture<TpoadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TpoadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpoadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
