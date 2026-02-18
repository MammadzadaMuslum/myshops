import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService, Shop } from '../../services/shop.service';
import { ProductService, Product } from '../../services/product.service';
import { FavoritesService } from '../../services/favorites.service';
import { CartService, CartItem } from '../../services/cart.service';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';

interface TableProduct {
  product: Product;
  shopName: string;
}

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DefaultImagePipe],
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  shops: Shop[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  
  searchTerm = '';
  

  viewMode: 'grid' | 'table' = 'table';
  

  tableProducts: TableProduct[] = [];
  

  searchResults: Array<{type: 'shop' | 'product'; item: Shop | Product; shopName?: string}> = [];

  selectedCategory = '';
  selectedShop: number | null = null;
  sortBy: 'name' | 'price-low' | 'price-high' | 'stock' = 'name';
  showFilters = false;
  activeTab: 'all' | 'shops' | 'products' = 'all';
  
  cartItems: CartItem[] = [];
  
  shopCategories: string[] = [];
  productCategories: string[] = [];

  constructor(
    private shopService: ShopService,
    private productService: ProductService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart.items;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.shopService.getShops().subscribe({
      next: (shops) => {
        this.shops = shops;
        this.shopCategories = [...new Set(shops.map(s => s.category))];
        
        this.productService.getProducts().subscribe({
          next: (products) => {
            this.products = products;
            this.filteredProducts = [...products];
            this.productCategories = [...new Set(products.map(p => p.category))];
            this.loading = false;
            this.applySearch();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading products:', err);
            this.error = 'Failed to load products.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading shops:', err);
        this.error = 'Failed to load shops.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  onSearch(): void {
    this.applySearch();
  }

  applySearch(): void {
    const query = this.searchTerm.toLowerCase().trim();
    
    // Filter products for both views
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !query || 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesShop = !this.selectedShop || product.shopId === this.selectedShop;
      
      return matchesSearch && matchesCategory && matchesShop;
    });

    // Sort products
    if (this.sortBy === 'price-low') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'stock') {
      this.filteredProducts.sort((a, b) => b.stock - a.stock);
    } else if (this.sortBy === 'name') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Prepare table data
    this.tableProducts = this.filteredProducts.map(product => ({
      product,
      shopName: this.getShopName(product.shopId)
    }));

    // Prepare grid data (original logic)
    this.buildGridResults();
    this.cdr.detectChanges();
  }

  buildGridResults(): void {
    const query = this.searchTerm.toLowerCase().trim();
    this.searchResults = [];
    
    // Filter and add shops
    const filteredShops = this.shops.filter(shop => {
      const matchesSearch = !query || 
        shop.name.toLowerCase().includes(query) ||
        shop.ownerName.toLowerCase().includes(query) ||
        shop.category.toLowerCase().includes(query) ||
        shop.address.toLowerCase().includes(query);
      
      const matchesCategory = !this.selectedCategory || shop.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    filteredShops.forEach(shop => {
      this.searchResults.push({ type: 'shop', item: shop });
    });
    
    // Add filtered products
    this.filteredProducts.forEach(product => {
      this.searchResults.push({ 
        type: 'product', 
        item: product,
        shopName: this.getShopName(product.shopId)
      });
    });

    if (this.searchTerm) {
      const query = this.searchTerm.toLowerCase();
      this.searchResults.sort((a, b) => {
        const aName = (a.item.name || '').toLowerCase();
        const bName = (b.item.name || '').toLowerCase();
        const aExact = aName === query ? 2 : aName.startsWith(query) ? 1 : 0;
        const bExact = bName === query ? 2 : bName.startsWith(query) ? 1 : 0;
        return bExact - aExact;
      });
    }
  }

  setViewMode(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applySearch();
  }

  addToCart(product: Product, shopName: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.cartService.addToCart(product, shopName);
    this.cdr.detectChanges();
  }

  removeFromCart(productId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.cartService.removeFromCart(productId);
    this.cdr.detectChanges();
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  getCartQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item?.quantity || 0;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedShop = null;
    this.sortBy = 'name';
    this.activeTab = 'all';
    this.applySearch();
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || !!this.selectedCategory || !!this.selectedShop || this.sortBy !== 'name';
  }

  getResultsCount(): number {
    if (this.activeTab === 'shops') return this.searchResults.filter(r => r.type === 'shop').length;
    if (this.activeTab === 'products') return this.filteredProducts.length;
    return this.searchResults.length;
  }

  getShopName(shopId: number): string {
    const shop = this.shops.find(s => s.id === shopId);
    return shop?.name || 'Unknown Shop';
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  setActiveTab(tab: 'all' | 'shops' | 'products'): void {
    this.activeTab = tab;
  }

  get visibleResults() {
    if (this.activeTab === 'shops') {
      return this.searchResults.filter(r => r.type === 'shop');
    }
    if (this.activeTab === 'products') {
      return this.searchResults.filter(r => r.type === 'product');
    }
    return this.searchResults;
  }

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
