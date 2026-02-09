import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../services/product.service';
import { Shop } from '../../../services/shop.service';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-in">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">{{ product ? 'Edit Product' : 'Add New Product' }}</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select Shop *</label>
            <select [(ngModel)]="formData.shopId" name="shopId" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a Shop</option>
              <option *ngFor="let shop of shops" [value]="shop.id">{{ shop.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input type="text" [(ngModel)]="formData.name" name="name" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="formData.description" name="description" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input type="number" [(ngModel)]="formData.price" name="price" required min="0" step="0.01"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" [(ngModel)]="formData.stock" name="stock" required min="0"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select [(ngModel)]="formData.category" name="category" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="url" [(ngModel)]="formData.imageUrl" name="imageUrl"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p class="text-xs text-gray-500 mt-1">Leave empty for default image</p>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" (click)="close.emit()"
                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" [disabled]="!isFormValid()"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {{ product ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductFormModalComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() shops: Shop[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    shopId: null as number | null,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  };

  ngOnInit(): void {
    if (this.product) {
      this.formData = {
        shopId: this.product.shopId,
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        stock: this.product.stock,
        category: this.product.category,
        imageUrl: this.product.imageUrl || ''
      };
    }
  }

  isFormValid(): boolean {
    return !!(this.formData.shopId && this.formData.name && this.formData.price >= 0 && 
              this.formData.stock >= 0 && this.formData.category);
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const data = {
        ...this.formData,
        shopId: Number(this.formData.shopId)
      };
      this.save.emit(data);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}