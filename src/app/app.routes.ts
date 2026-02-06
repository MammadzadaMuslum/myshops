import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home} from './pages/home/home';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  

  { path: 'login', component: Login },
  

  { path: 'register', component: Register },
  

  { path: 'home', component: Home },
  

  { path: 'admin', component: Admin },

  { path: '**', redirectTo: '/home' }
];