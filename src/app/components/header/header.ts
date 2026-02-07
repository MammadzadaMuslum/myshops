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
  ],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  favoritesCount = 0;

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
}
