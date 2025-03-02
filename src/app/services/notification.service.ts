import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../shared/components/snackbar/notification/notification.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private durationInSeconds = 5;

  open(message: string, type: 'SUCCESS' | 'ERROR') {
    const panelClass =
      type === 'SUCCESS'
        ? 'notification-bg__success'
        : 'notification-bg__error';
    const snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: [panelClass],
    });

    snackBarRef.instance.message = message;
  }
}
