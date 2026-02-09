// src/app/components/header/header.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    ProfileModalComponent,
  ],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  favoritesCount = 0;
  isMobileMenuOpen = false;
  isProfileModalOpen = false;

  constructor(
    public userService: UserService,
    private favoritesService: FavoritesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.userService.loadUserFromStorage();
  }

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(() => {
      this.favoritesCount = this.favoritesService.getFavoritesCount();
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.userService.clearUser();
    this.router.navigateByUrl('/login');
  }

  onFavoritesClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/favorites']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  logoutAndClose() {
    this.closeMobileMenu();
    this.logout();
  }

  openProfileModal() {
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  onProfileSaved() {
  }

  onProfileDeleted() {
    this.closeProfileModal();
    this.logout();
  }
}
