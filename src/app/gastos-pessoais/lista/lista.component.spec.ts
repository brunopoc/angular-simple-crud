import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosPessoaisListaComponent } from './lista.component';

describe('GastosPessoaisListaComponent', () => {
  let component: GastosPessoaisListaComponent;
  let fixture: ComponentFixture<GastosPessoaisListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosPessoaisListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosPessoaisListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
