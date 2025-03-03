import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleElement = fixture.debugElement.query(
      By.css('[data-test-id="header-navbar-title"]')
    );
    expect(titleElement.nativeElement.textContent).toContain('Gastos Pessoais');
  });

  it('should display the menu toggle button', () => {
    const toggleButton = fixture.debugElement.query(
      By.css('[data-test-id="header-menu-toggle"]')
    );
    expect(toggleButton).toBeTruthy();
  });

  it('should display the sidenav when menu toggle is clicked', () => {
    const toggleButton = fixture.debugElement.query(
      By.css('[data-test-id="header-menu-toggle"]')
    );
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    const sidenav = fixture.debugElement.query(
      By.css('[data-test-id="header-sidenav"]')
    );
    expect(sidenav.classes['mat-drawer-opened']).toBe(true);
  });

  it('should display the categories link in the sidenav', () => {
    const toggleButton = fixture.debugElement.query(
      By.css('[data-test-id="header-menu-toggle"]')
    );
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    const categoriasLink = fixture.debugElement.query(
      By.css('[data-test-id="header-sidenav-categorias-link"]')
    );
    expect(categoriasLink).toBeTruthy();
  });

  it('should display the personal expenses link in the sidenav', () => {
    const toggleButton = fixture.debugElement.query(
      By.css('[data-test-id="header-menu-toggle"]')
    );
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    const gastosLink = fixture.debugElement.query(
      By.css('[data-test-id="header-sidenav-gastos-link"]')
    );
    expect(gastosLink).toBeTruthy();
  });

  it('should display the linkedin link', () => {
    const linkedinLink = fixture.debugElement.query(
      By.css('[data-test-id="header-linkedin-link"]')
    );
    expect(linkedinLink).toBeTruthy();
  });
});
