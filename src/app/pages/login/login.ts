import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  loading = false;
  showPassword = false;
  loginError = '';

  private apiUrl = `${environment.apiUrl}/users`;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {
    this.loginError = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const inputName = this.form.value.name?.trim();
    const inputPassword = this.form.value.password;

    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (users) => {
        const userFound = users.find(
          (u) => (u.name === inputName || u.email === inputName) && u.password === inputPassword
        );

        this.loading = false;

        if (userFound) {
          this.userService.setUser(userFound.name);
          this.router.navigateByUrl('/');
        } else {
          this.loginError = 'İstifadəçi adı/email və ya şifrə yanlışdır!';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.loginError = 'Sistem xətası: Məlumatlar yüklənə bilmədi.';
        console.error(err);
      },
    });
  }

  get name() { return this.form.get('name'); }
  get password() { return this.form.get('password'); }
}
