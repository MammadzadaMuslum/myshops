import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Shop } from '../../../services/shop.service';
import { ShopFormModalComponent } from './shop-form-modal.component';

@Component({
  selector: 'app-admin-shops',
  standalone: true,
  imports: [CommonModule, ShopFormModalComponent],
  templateUrl: './admin-shops.component.html',
  styleUrls: ['./admin-shops.component.css']
})
export class AdminShopsComponent implements OnInit {
  shops: Shop[] = [];
  loading = true;
  error: string | null = null;
  showModal = false;
  editingShop: Shop | null = null;

  constructor(
    private shopService: ShopService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.shopService.getShops().subscribe({
      next: (data) => {
        console.log('Shops loaded:', data);
        this.shops = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading shops:', err);
        this.error = 'Failed to load shops. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal(): void {
    this.editingShop = null;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(shop: Shop): void {
    this.editingShop = shop;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingShop = null;
    this.cdr.detectChanges();
  }

  saveShop(shopData: any): void {
    if (this.editingShop) {
      // Update existing shop
      this.shopService.updateShop(this.editingShop.id, shopData).subscribe({
        next: () => {
          this.closeModal();
          this.loadShops();
        },
        error: (err) => {
          console.error('Error updating shop:', err);
          alert('Failed to update shop. Please try again.');
        }
      });
    } else {
      // Create new shop
      const newShop = {
        ...shopData,
        createdAt: new Date().toISOString()
      };
      this.shopService.createShop(newShop).subscribe({
        next: () => {
          this.closeModal();
          this.loadShops();
        },
        error: (err) => {
          console.error('Error creating shop:', err);
          alert('Failed to create shop. Please try again.');
        }
      });
    }
  }

  deleteShop(id: number): void {
    if (confirm('Are you sure you want to delete this shop?')) {
      this.shopService.deleteShop(id).subscribe({
        next: () => {
          this.loadShops();
        },
        error: (err) => {
          console.error('Error deleting shop:', err);
          alert('Failed to delete shop. Please try again.');
        }
      });
    }
  }
}