import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { CartStore } from '../../store/cart.store';
import { ShopsStore } from '../../store/shops.store';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';
import { Shop } from '../../services/shop.service';
import { Product } from '../../services/product.service';
import { ProductWithShop } from '../../store/shops.store';

interface SearchResult {
  type: 'shop' | 'product';
  item: Shop | Product;
  shopName?: string;
}

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DefaultImagePipe],
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css'],
  providers: [ShopsStore]
})
export class ShopsComponent implements OnInit {
  cartStore = inject(CartStore);
  shopsStore = inject(ShopsStore);

  // Local state for filters (not in store)
  selectedCategory = '';
  selectedShop: number | null = null;
  sortBy: 'name' | 'price-low' | 'price-high' | 'stock' = 'name';
  showFilters = false;
  activeTab: 'all' | 'shops' | 'products' = 'all';

  // Categories for filters
  shopCategories: string[] = [];
  productCategories: string[] = [];

  // Grid view computed results
  gridResults: SearchResult[] = [];

  // Local cache of store state
  shops: Shop[] = [];
  private productsFlat: ProductWithShop[] = [];
  private searchTerm = '';

  constructor(
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shopsStore.loadShopsAndProducts();
    
    // Subscribe to store data
    this.shopsStore.shops$.subscribe(shops => {
      this.shops = shops;
      this.shopCategories = [...new Set(shops.map(s => s.category))];
      this.updateGridResults();
    });
    
    this.shopsStore.productsFlat$.subscribe(products => {
      this.productsFlat = products;
      this.productCategories = [...new Set(products.map(p => p.category))];
      this.updateGridResults();
    });
    
    this.shopsStore.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.updateGridResults();
    });
  }

  // Search method - updates store
  updateSearchTerm(term: string): void {
    this.shopsStore.setSearchTerm(term);
  }

  clearSearch(): void {
    this.shopsStore.setSearchTerm('');
  }

  // View mode
  setViewMode(mode: 'grid' | 'table'): void {
    this.shopsStore.setViewMode(mode);
  }

  // Grid results computed from store
  updateGridResults(): void {
    const shops = this.shops;
    const products = this.productsFlat;
    const searchTerm = this.searchTerm;
    const query = searchTerm.toLowerCase().trim();

    this.gridResults = [];

    // Filter and add shops
    const filteredShops = shops.filter(shop => {
      if (!query) return true;
      return shop.name.toLowerCase().includes(query) ||
        shop.ownerName.toLowerCase().includes(query) ||
        shop.category.toLowerCase().includes(query) ||
        shop.address.toLowerCase().includes(query);
    });

    filteredShops.forEach(shop => {
      this.gridResults.push({ type: 'shop', item: shop });
    });

    // Filter and add products
    const filteredProducts = products.filter(product => {
      if (!query) return true;
      return product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
    });

    filteredProducts.forEach(product => {
      this.gridResults.push({
        type: 'product',
        item: product,
        shopName: product.shopName
      });
    });

    // Sort by relevance if search exists
    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      this.gridResults.sort((a, b) => {
        const aName = (a.item.name || '').toLowerCase();
        const bName = (b.item.name || '').toLowerCase();
        const aExact = aName === lowerQuery ? 2 : aName.startsWith(lowerQuery) ? 1 : 0;
        const bExact = bName === lowerQuery ? 2 : bName.startsWith(lowerQuery) ? 1 : 0;
        return bExact - aExact;
      });
    }

    this.cdr.detectChanges();
  }

  // Cart methods using store
  addToCart(product: Product, shopName: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.cartStore.addToCart({ ...product, shopName });
  }

  removeFromCart(productId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.cartStore.removeFromCart(productId);
  }

  isInCart(productId: number): boolean {
    return this.cartStore.isInCart(productId);
  }

  getCartQuantity(productId: number): number {
    return this.cartStore.getQuantity(productId);
  }

  // Helper methods
  clearFilters(): void {
    this.shopsStore.setSearchTerm('');
    this.selectedCategory = '';
    this.selectedShop = null;
    this.sortBy = 'name';
    this.activeTab = 'all';
    this.updateGridResults();
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || 
           !!this.selectedCategory || 
           !!this.selectedShop || 
           this.sortBy !== 'name';
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  setActiveTab(tab: 'all' | 'shops' | 'products'): void {
    this.activeTab = tab;
  }

  getResultsCount(): number {
    if (this.activeTab === 'shops') {
      return this.gridResults.filter(r => r.type === 'shop').length;
    }
    if (this.activeTab === 'products') {
      return this.gridResults.filter(r => r.type === 'product').length;
    }
    return this.gridResults.length;
  }

  get visibleResults(): SearchResult[] {
    if (this.activeTab === 'shops') {
      return this.gridResults.filter(r => r.type === 'shop');
    }
    if (this.activeTab === 'products') {
      return this.gridResults.filter(r => r.type === 'product');
    }
    return this.gridResults;
  }

  // Type guards
  isShop(item: Shop | Product): item is Shop {
    return 'status' in item && 'ownerName' in item;
  }

  isProduct(item: Shop | Product): item is Product {
    return 'shopId' in item && 'price' in item;
  }

  asShop(item: Shop | Product): Shop {
    return item as Shop;
  }

  asProduct(item: Shop | Product): Product {
    return item as Product;
  }

  // Favorites
  toggleFavorite(product: Product, shopName: string | undefined, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.toggleFavorite(product, shopName || 'Unknown Shop');
    this.cdr.detectChanges();
  }

  isFavorite(productId: number): boolean {
    return this.favoritesService.isFavorite(productId);
  }
}
