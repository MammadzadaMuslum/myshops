import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shop } from '../../../services/shop.service';
import { ValidationErrorModalComponent } from '../../../components/validation-error-modal/validation-error-modal.component';

@Component({
  selector: 'app-shop-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ValidationErrorModalComponent],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-in">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">{{ shop ? 'Edit Shop' : 'Add New Shop' }}</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
            <input type="text" [(ngModel)]="formData.name" name="name" required
                   [class.border-red-500]="errors['name']"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p *ngIf="errors['name']" class="text-xs text-red-600 mt-1">{{ errors['name'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
            <input type="text" [(ngModel)]="formData.ownerName" name="ownerName" required
                   [class.border-red-500]="errors['ownerName']"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p *ngIf="errors['ownerName']" class="text-xs text-red-600 mt-1">{{ errors['ownerName'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Owner Email *</label>
            <input type="email" [(ngModel)]="formData.ownerEmail" name="ownerEmail" required
                   [class.border-red-500]="errors['ownerEmail']"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p *ngIf="errors['ownerEmail']" class="text-xs text-red-600 mt-1">{{ errors['ownerEmail'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
            <input type="tel" [(ngModel)]="formData.contactPhone" name="contactPhone" required
                   [class.border-red-500]="errors['contactPhone']"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p *ngIf="errors['contactPhone']" class="text-xs text-red-600 mt-1">{{ errors['contactPhone'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input type="text" [(ngModel)]="formData.address" name="address" required
                   [class.border-red-500]="errors['address']"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p *ngIf="errors['address']" class="text-xs text-red-600 mt-1">{{ errors['address'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select [(ngModel)]="formData.category" name="category" required
                    [class.border-red-500]="errors['category']"
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
            <p *ngIf="errors['category']" class="text-xs text-red-600 mt-1">{{ errors['category'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select [(ngModel)]="formData.status" name="status" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" (click)="close.emit()"
                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {{ shop ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Validation Error Modal -->
    <app-validation-error-modal
      *ngIf="showValidationError"
      title="Validation Error"
      message="You cannot create a new shop without filling all required fields."
      buttonText="OK"
      (close)="showValidationError = false">
    </app-validation-error-modal>
  `
})
export class ShopFormModalComponent implements OnInit {
  @Input() shop: Shop | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    name: '',
    ownerName: '',
    ownerEmail: '',
    contactPhone: '',
    address: '',
    category: '',
    status: 'active'
  };

  errors: Record<string, string> = {};
  showValidationError = false;

  ngOnInit(): void {
    if (this.shop) {
      this.formData = {
        name: this.shop.name,
        ownerName: this.shop.ownerName,
        ownerEmail: this.shop.ownerEmail,
        contactPhone: this.shop.contactPhone,
        address: this.shop.address,
        category: this.shop.category,
        status: this.shop.status
      };
    }
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.formData.name.trim()) {
      this.errors['name'] = 'Shop name is required';
      isValid = false;
    }

    if (!this.formData.ownerName.trim()) {
      this.errors['ownerName'] = 'Owner name is required';
      isValid = false;
    }

    if (!this.formData.ownerEmail.trim()) {
      this.errors['ownerEmail'] = 'Owner email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.ownerEmail)) {
        this.errors['ownerEmail'] = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!this.formData.contactPhone.trim()) {
      this.errors['contactPhone'] = 'Contact phone is required';
      isValid = false;
    }

    if (!this.formData.address.trim()) {
      this.errors['address'] = 'Address is required';
      isValid = false;
    }

    if (!this.formData.category) {
      this.errors['category'] = 'Category is required';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.save.emit(this.formData);
    } else {
      this.showValidationError = true;
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
