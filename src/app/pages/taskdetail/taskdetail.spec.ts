import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Taskdetail } from './taskdetail';

describe('Taskdetail', () => {
  let component: Taskdetail;
  let fixture: ComponentFixture<Taskdetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Taskdetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Taskdetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
