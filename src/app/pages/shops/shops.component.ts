import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopService, Shop } from '../../services/shop.service';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  shops: Shop[] = [];
  loading = true;
  error: string | null = null;

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
}