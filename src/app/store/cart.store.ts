import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Product } from '../services/product.service';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  shopName: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

@Injectable({ providedIn: 'root' })
export class CartStore extends ComponentStore<CartState> {
  
  constructor() {
    super(initialState);
    this.loadFromStorage();
  }

  // Selectors
  readonly items$ = this.select(state => state.items);
  
  readonly totalPrice$ = this.select(state => 
    state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  );
  
  readonly totalCount$ = this.select(state => 
    state.items.reduce((count, item) => count + item.quantity, 0)
  );

  readonly addToCart = this.updater((state, product: Product & { shopName?: string }) => {
    const existingItemIndex = state.items.findIndex(item => item.productId === product.id);
    
    let newItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      newItems = state.items.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = Math.min(item.quantity + 1, product.stock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        shopName: product.shopName || 'Unknown Shop',
        stock: product.stock
      };
      newItems = [...state.items, newItem];
    }
    
    const newState = { ...state, items: newItems };
    this.saveToStorage(newState.items);
    return newState;
  });

  readonly removeFromCart = this.updater((state, productId: number) => {
    const newItems = state.items.filter(item => item.productId !== productId);
    const newState = { ...state, items: newItems };
    this.saveToStorage(newState.items);
    return newState;
  });

  readonly updateQuantity = this.updater((state, payload: { productId: number; quantity: number }) => {
    const { productId, quantity } = payload;
    
    if (quantity <= 0) {
      const newItems = state.items.filter(item => item.productId !== productId);
      const newState = { ...state, items: newItems };
      this.saveToStorage(newState.items);
      return newState;
    }
    
    const newItems = state.items.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, Math.min(quantity, item.stock));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    const newState = { ...state, items: newItems };
    this.saveToStorage(newState.items);
    return newState;
  });

  readonly clearCart = this.updater((state) => {
    this.saveToStorage([]);
    return { ...state, items: [] };
  });

  isInCart(productId: number): boolean {
    return this.get().items.some(item => item.productId === productId);
  }

  getQuantity(productId: number): number {
    const item = this.get().items.find(item => item.productId === productId);
    return item?.quantity || 0;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('myshop_cart');
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        this.setState({ items });
      }
    } catch {
      console.error('Failed to load cart from storage');
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem('myshop_cart', JSON.stringify(items));
    } catch {
      console.error('Failed to save cart to storage');
    }
  }
}
