import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../services/product.service';
import { ShopService, Shop } from '../../../services/shop.service';
import { ProductFormModalComponent } from './product-form-modal.component';
import { DefaultImagePipe } from '../../../pipes/default-image.pipe';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ProductFormModalComponent, DefaultImagePipe],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  shops: Shop[] = [];
  loading = true;
  error: string | null = null;
  showModal = false;
  editingProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private shopService: ShopService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadShops();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadShops(): void {
    this.shopService.getShops().subscribe({
      next: (data) => {
        this.shops = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading shops:', err);
      }
    });
  }

  getShopName(shopId: number): string {
    const shop = this.shops.find(s => s.id === shopId);
    return shop ? shop.name : `Shop #${shopId}`;
  }

  openAddModal(): void {
    this.editingProduct = null;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
    this.cdr.detectChanges();
  }

  saveProduct(productData: any): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          alert('Failed to update product. Please try again.');
        }
      });
    } else {
      const newProduct = {
        ...productData,
        createdAt: new Date().toISOString()
      };
      this.productService.createProduct(newProduct).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error creating product:', err);
          alert('Failed to create product. Please try again.');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
}