import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  shopName: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'myshop_cart';
  
  private cartSubject = new BehaviorSubject<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });
  
  public cart$: Observable<CartState> = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem(this.CART_STORAGE_KEY);
    if (stored) {
      try {
        const items: CartItem[] = JSON.parse(stored);
        this.updateCartState(items);
      } catch {
        console.error('Failed to load cart from storage');
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
  }

  private updateCartState(items: CartItem[]): void {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    this.cartSubject.next({
      items,
      totalItems,
      totalPrice
    });
    
    this.saveCartToStorage(items);
  }

  addToCart(product: Product, shopName: string, quantity: number = 1): void {
    const currentItems = this.cartSubject.value.items;
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {

      currentItems[existingItemIndex].quantity += quantity;
    } else {

      currentItems.push({
        product,
        shopName,
        quantity
      });
    }

    this.updateCartState([...currentItems]);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartSubject.value.items;
    const filteredItems = currentItems.filter(
      item => item.product.id !== productId
    );
    this.updateCartState(filteredItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartSubject.value.items;
    const itemIndex = currentItems.findIndex(
      item => item.product.id === productId
    );

    if (itemIndex >= 0) {
      currentItems[itemIndex].quantity = quantity;
      this.updateCartState([...currentItems]);
    }
  }

  clearCart(): void {
    this.updateCartState([]);
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value.items;
  }

  getCartTotal(): number {
    return this.cartSubject.value.totalPrice;
  }

  getCartItemsCount(): number {
    return this.cartSubject.value.totalItems;
  }

  isInCart(productId: number): boolean {
    return this.cartSubject.value.items.some(
      item => item.product.id === productId
    );
  }
}
