import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosAdicionarComponent } from './adicionar.component';

describe('GastosAdicionarComponent', () => {
  let component: GastosAdicionarComponent;
  let fixture: ComponentFixture<GastosAdicionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosAdicionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
