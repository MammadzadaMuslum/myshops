import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminShopsComponent } from './shops/admin-shops.component';
import { AdminProductsComponent } from './products/admin-products.component';

export const adminRoutes: Routes = [
  { 
    path: '', 
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'shops', pathMatch: 'full' },
      { path: 'shops', component: AdminShopsComponent },
      { path: 'products', component: AdminProductsComponent }
    ]
  }
];