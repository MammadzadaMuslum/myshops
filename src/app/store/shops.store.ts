import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap, switchMap, catchError, of } from 'rxjs';
import { Shop, ShopService } from '../services/shop.service';
import { Product, ProductService } from '../services/product.service';

export interface ProductWithShop extends Product {
  shopName: string;
}

export interface ShopsState {
  shops: Shop[];
  productsFlat: ProductWithShop[];
  searchTerm: string;
  viewMode: 'grid' | 'table';
  loading: boolean;
  error: string | null;
}

const initialState: ShopsState = {
  shops: [],
  productsFlat: [],
  searchTerm: '',
  viewMode: 'table',
  loading: false,
  error: null
};

@Injectable({ providedIn: 'root' })
export class ShopsStore extends ComponentStore<ShopsState> {
  private shopService = inject(ShopService);
  private productService = inject(ProductService);

  constructor() {
    super(initialState);
  }

  // Selectors
  readonly shops$ = this.select(state => state.shops);
  readonly productsFlat$ = this.select(state => state.productsFlat);
  readonly searchTerm$ = this.select(state => state.searchTerm);
  readonly viewMode$ = this.select(state => state.viewMode);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  readonly filteredProducts$ = this.select(
    this.productsFlat$,
    this.searchTerm$,
    (products, searchTerm) => {
      if (!searchTerm.trim()) {
        return products;
      }
      
      const query = searchTerm.toLowerCase().trim();
      return products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.shopName.toLowerCase().includes(query)
      );
    }
  );

  readonly filteredShops$ = this.select(
    this.shops$,
    this.searchTerm$,
    (shops, searchTerm) => {
      if (!searchTerm.trim()) {
        return shops;
      }
      
      const query = searchTerm.toLowerCase().trim();
      return shops.filter(shop => 
        shop.name.toLowerCase().includes(query) ||
        shop.ownerName.toLowerCase().includes(query) ||
        shop.category.toLowerCase().includes(query) ||
        shop.address.toLowerCase().includes(query)
      );
    }
  );

  // Updaters
  readonly setSearchTerm = this.updater((state, searchTerm: string) => ({
    ...state,
    searchTerm
  }));

  readonly setViewMode = this.updater((state, viewMode: 'grid' | 'table') => ({
    ...state,
    viewMode
  }));

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));

  readonly setError = this.updater((state, error: string | null) => ({
    ...state,
    error
  }));

  readonly setShops = this.updater((state, shops: Shop[]) => ({
    ...state,
    shops
  }));

  readonly setProductsFlat = this.updater((state, products: ProductWithShop[]) => ({
    ...state,
    productsFlat: products
  }));

  // Effects
  readonly loadShopsAndProducts = this.effect<void>(
    trigger$ => trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() => 
        this.shopService.getShops().pipe(
          switchMap(shops => {
            this.setShops(shops);
            return this.productService.getProducts().pipe(
              tap(products => {
                const productsWithShop: ProductWithShop[] = products.map(product => {
                  const shop = shops.find(s => s.id === product.shopId);
                  return {
                    ...product,
                    shopName: shop?.name || 'Unknown Shop'
                  };
                });
                this.setProductsFlat(productsWithShop);
                this.setLoading(false);
              }),
              catchError(error => {
                this.setError('Failed to load products');
                this.setLoading(false);
                return of([]);
              })
            );
          }),
          catchError(error => {
            this.setError('Failed to load shops');
            this.setLoading(false);
            return of([]);
          })
        )
      )
    )
  );
}
