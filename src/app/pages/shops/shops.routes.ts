import { Routes } from '@angular/router';
import { ShopsComponent } from './shops.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const shopsRoutes: Routes = [
  { path: '', component: ShopsComponent },
  { path: ':id', component: ShopDetailComponent }
];

// Separate product routes that will be loaded at root level
export const productRoutes: Routes = [
  { path: 'products/:id', component: ProductDetailComponent }
];