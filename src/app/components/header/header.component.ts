import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Unsubscribe, User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
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
      this._notificationService.routerLink('');
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
