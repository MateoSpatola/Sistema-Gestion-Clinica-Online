import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Unsubscribe, User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _authService = inject(AuthService);
  private _notificationService = inject(NotificationService);

  private authSubscription?: Unsubscribe;
  user?: User | null;

  ngOnInit() {
    this.authSubscription = this._authService.auth.onAuthStateChanged(user => {
      this.user = user;
    })
  }

  async salir() {
    try {
      await this._authService.signOut();
      this._notificationService.showAlert('¡Sesión cerrada!', 'success', 1000);
    } catch (error) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Error: No se pudo cerrar sesión!', 'error', 1000);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
    }
  }
}
