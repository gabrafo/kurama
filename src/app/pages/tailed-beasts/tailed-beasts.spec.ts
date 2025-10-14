import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailedBeasts } from './tailed-beasts';

describe('TailedBeasts', () => {
  let component: TailedBeasts;
  let fixture: ComponentFixture<TailedBeasts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailedBeasts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailedBeasts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
