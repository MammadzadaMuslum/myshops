import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore, CartItem } from '../../store/cart.store';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-in">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Shopping Cart</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <!-- Empty Cart -->
          <div *ngIf="(cartStore.items$ | async)?.length === 0" class="text-center py-8">
            <p class="text-gray-500">Your cart is empty</p>
          </div>
          
          <!-- Cart Items -->
          <div *ngIf="(cartStore.items$ | async) as items" class="space-y-4">
            <div *ngFor="let item of items" class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 text-sm">{{ item.name }}</h4>
                <p class="text-xs text-gray-500">{{ item.shopName }}</p>
                <p class="text-blue-600 font-semibold text-sm">{{ '$' + item.price.toFixed(2) }}</p>
              </div>
              
              <div class="flex items-center gap-1">
                <button 
                  (click)="updateQuantity(item.productId, item.quantity - 1)"
                  class="w-7 h-7 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-sm"
                >
                  -
                </button>
                <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                <button 
                  (click)="updateQuantity(item.productId, item.quantity + 1)"
                  class="w-7 h-7 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-sm"
                >
                  +
                </button>
              </div>
              
              <button 
                (click)="removeItem(item.productId)"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            
            <!-- Total -->
            <div *ngIf="items.length > 0" class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="font-semibold text-gray-900">Total: {{ '$' + ((cartStore.totalPrice$ | async) || 0).toFixed(2) }}</span>
              </div>
              
              <div class="flex gap-3">
                <button 
                  (click)="close.emit()"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  (click)="checkout()"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <div *ngIf="showSuccess" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in" (click)="closeSuccess()">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-modal-in">
        <div class="p-6 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Success</h3>
          <p class="text-gray-600 mb-4">Your order has been completed successfully.</p>
          <button 
            (click)="closeSuccess()"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class CartModalComponent {
  @Output() close = new EventEmitter<void>();
  
  cartStore = inject(CartStore);
  showSuccess = false;

  updateQuantity(productId: number, quantity: number): void {
    this.cartStore.updateQuantity({ productId, quantity });
  }

  removeItem(productId: number): void {
    this.cartStore.removeFromCart(productId);
  }

  checkout(): void {
    this.cartStore.clearCart();
    this.showSuccess = true;
  }

  closeSuccess(): void {
    this.showSuccess = false;
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
