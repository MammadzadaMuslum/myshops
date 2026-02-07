import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shop {
  id: number;
  name: string;
  ownerName: string;
  ownerEmail: string;
  contactPhone: string;
  address: string;
  category: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:3000/shops';

  constructor(private http: HttpClient) {}

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl);
  }

  getShop(id: number): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/${id}`);
  }

  createShop(shop: Omit<Shop, 'id' | 'createdAt'>): Observable<Shop> {
    return this.http.post<Shop>(this.apiUrl, shop);
  }

  updateShop(id: number, shop: Partial<Shop>): Observable<Shop> {
    return this.http.put<Shop>(`${this.apiUrl}/${id}`, shop);
  }

  deleteShop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}