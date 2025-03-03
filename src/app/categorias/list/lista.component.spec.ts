import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasListaComponent } from './lista.component';

describe('CategoriasListaComponent', () => {
  let component: CategoriasListaComponent;
  let fixture: ComponentFixture<CategoriasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
