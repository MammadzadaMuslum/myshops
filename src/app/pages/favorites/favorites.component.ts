import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService, FavoriteItem } from '../../services/favorites.service';
import { ShopService, Shop } from '../../services/shop.service';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, DefaultImagePipe],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteItem[] = [];
  shops: Shop[] = [];
  loading = true;

  constructor(
    private favoritesService: FavoritesService,
    private shopService: ShopService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadShops();
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  loadShops(): void {
    this.shopService.getShops().subscribe({
      next: (shops) => {
        this.shops = shops;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading shops:', err);
      }
    });
  }

  removeFavorite(productId: number, event: Event): void {
    event.stopPropagation();
    this.favoritesService.removeFromFavorites(productId);
  }

  clearAllFavorites(): void {
    if (confirm('Are you sure you want to remove all favorites?')) {
      this.favoritesService.clearFavorites();
    }
  }

  getShopName(shopId: number): string {
    const shop = this.shops.find(s => s.id === shopId);
    return shop?.name || 'Unknown Shop';
  }

  getFavoritesCount(): number {
    return this.favorites.length;
  }
}