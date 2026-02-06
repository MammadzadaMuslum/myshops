import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 


//components import
import { Header } from './components/header/header';

// Material import
import { MatButtonModule } from '@angular/material/button';

// JSON import
import mockData from '../assets/mockdata.json';

@Component({
  selector: 'app-root',
  standalone: true,
imports: [
  RouterOutlet,
  CommonModule,
  MatButtonModule,
  MatButtonModule, 
  Header,     
],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] 
})
export class App {
  protected readonly title = signal('my-shop2');
    stores = mockData.stores;
  users = mockData.users;
}
