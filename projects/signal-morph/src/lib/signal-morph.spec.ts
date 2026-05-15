import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalMorph } from './signal-morph';

describe('SignalMorph', () => {
  let component: SignalMorph;
  let fixture: ComponentFixture<SignalMorph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalMorph],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalMorph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
