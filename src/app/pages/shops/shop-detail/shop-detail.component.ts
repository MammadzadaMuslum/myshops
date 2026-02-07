import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ShopService, Shop } from '../../../services/shop.service';
import { ProductService, Product } from '../../../services/product.service';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DefaultImagePipe],
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  shop: Shop | null = null;
  products: Product[] = [];
  relatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private shopService: ShopService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const shopId = Number(this.route.snapshot.paramMap.get('id'));
    if (shopId) {
      this.loadShopData(shopId);
    } else {
      this.router.navigate(['/shops']);
    }
  }

  loadShopData(shopId: number): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.shopService.getShop(shopId).subscribe({
      next: (shop) => {
        this.shop = shop;
        this.loadShopProducts(shopId);
      },
      error: (err) => {
        console.error('Error loading shop:', err);
        this.error = 'Shop not found.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadShopProducts(shopId: number): void {
    this.productService.getProductsByShop(shopId).subscribe({
      next: (products) => {
        this.products = products;
        
        // Load related products (same category, from other shops)
        if (products.length > 0) {
          this.loadRelatedProducts(products[0].category, shopId);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedProducts(category: string, excludeShopId: number): void {
    this.productService.getProducts().subscribe({
      next: (allProducts) => {
        this.relatedProducts = allProducts
          .filter(p => p.category === category && p.shopId !== excludeShopId)
          .slice(0, 4);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}