import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface FavoriteItem {
  product: Product;
  shopName: string;
  addedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'my_shop_favorites';
  private favorites: FavoriteItem[] = [];
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.favorites = JSON.parse(stored);
        this.favoritesSubject.next(this.favorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
      this.favoritesSubject.next(this.favorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  addToFavorites(product: Product, shopName: string): void {
    const exists = this.favorites.some(item => item.product.id === product.id);
    if (!exists) {
      this.favorites.push({
        product,
        shopName,
        addedAt: new Date().toISOString()
      });
      this.saveFavorites();
    }
  }

  removeFromFavorites(productId: number): void {
    this.favorites = this.favorites.filter(item => item.product.id !== productId);
    this.saveFavorites();
  }

  toggleFavorite(product: Product, shopName: string): void {
    if (this.isFavorite(product.id)) {
      this.removeFromFavorites(product.id);
    } else {
      this.addToFavorites(product, shopName);
    }
  }

  isFavorite(productId: number): boolean {
    return this.favorites.some(item => item.product.id === productId);
  }

  getFavorites(): FavoriteItem[] {
    return this.favorites;
  }

  getFavoritesCount(): number {
    return this.favorites.length;
  }

  clearFavorites(): void {
    this.favorites = [];
    this.saveFavorites();
  }
}