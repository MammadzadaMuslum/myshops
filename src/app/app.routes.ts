import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shops', loadChildren: () => import('./pages/shops/shops.routes').then(m => m.shopsRoutes) },
  { path: 'products/:id', loadComponent: () => import('./pages/shops/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes) },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '/' }
];