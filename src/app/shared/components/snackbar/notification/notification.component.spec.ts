import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import {
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let snackBarRefMock: jasmine.SpyObj<MatSnackBarRef<NotificationComponent>>;

  beforeEach(async () => {
    snackBarRefMock = jasmine.createSpyObj('MatSnackBarRef', [
      'dismissWithAction',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        NotificationComponent,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
      ],
      providers: [{ provide: MatSnackBarRef, useValue: snackBarRefMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    component.message = 'Test Message';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message from data', () => {
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(
      By.css('[data-test-id="notification-message"]')
    );
    expect(messageElement.nativeElement.textContent).toContain('Test Message');
  });

  it('should dismiss snack bar when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(
      By.css('[data-test-id="notification-close-button"]')
    );
    closeButton.nativeElement.click();
    expect(snackBarRefMock.dismissWithAction).toHaveBeenCalled();
  });
});
