import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { ShopService, Shop } from '../../../services/shop.service';
import { FavoritesService } from '../../../services/favorites.service';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DefaultImagePipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  shop: Shop | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  isFavorite = false;

  constructor(
    private productService: ProductService,
    private shopService: ShopService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.loadProductData(productId);
    } else {
      this.router.navigate(['/shops']);
    }
  }

  loadProductData(productId: number): void {
    this.loading = true;
    this.error = null;
    this.isFavorite = this.favoritesService.isFavorite(productId);
    this.cdr.detectChanges();

    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadShopInfo(product.shopId);
        this.loadRelatedProducts(product);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Product not found.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadShopInfo(shopId: number): void {
    this.shopService.getShop(shopId).subscribe({
      next: (shop) => {
        this.shop = shop;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedProducts(currentProduct: Product): void {
    this.productService.getProducts().subscribe({
      next: (allProducts) => {
        this.relatedProducts = allProducts
          .filter(p => 
            p.id !== currentProduct.id && 
            (p.category === currentProduct.category || p.shopId === currentProduct.shopId)
          )
          .slice(0, 4);
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(): void {
    if (this.product && this.shop) {
      this.favoritesService.toggleFavorite(this.product, this.shop.name);
      this.isFavorite = this.favoritesService.isFavorite(this.product.id);
      this.cdr.detectChanges();
    }
  }
}