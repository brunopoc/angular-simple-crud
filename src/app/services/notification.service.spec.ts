import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { NotificationComponent } from '../shared/components/snackbar/notification/notification.component';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a success notification', () => {
    const snackBarSpy = spyOn(snackBar, 'openFromComponent');
    service.open('Success message', 'SUCCESS');
    expect(snackBarSpy).toHaveBeenCalledWith(NotificationComponent, jasmine.objectContaining({
      duration: 5000,
      panelClass: ['notification-bg__success'],
    }));
  });

  it('should open an error notification', () => {
    const snackBarSpy = spyOn(snackBar, 'openFromComponent');
    service.open('Error message', 'ERROR');
    expect(snackBarSpy).toHaveBeenCalledWith(NotificationComponent, jasmine.objectContaining({
      duration: 5000,
      panelClass: ['notification-bg__error'],
    }));
  });
});