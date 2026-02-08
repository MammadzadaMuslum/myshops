import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  registerError = '';
  registerSuccess = '';

  private apiUrl = `${environment.apiUrl}/users`;

  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  submit() {
    this.registerError = '';
    this.registerSuccess = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const inputName = this.form.value.name?.trim();
    const inputEmail = this.form.value.email?.trim();
    const inputPassword = this.form.value.password;

    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (users) => {
        const userExists = users.find((u) => u.name === inputName || u.email === inputEmail);

        if (userExists) {
          this.loading = false;

          if (userExists.name === inputName) {
            this.registerError = 'Bu istifadəçi adı artıq mövcuddur!';
          } else {
            this.registerError = 'Bu email artıq qeydiyyatdan keçib!';
          }

          this.cdr.detectChanges();
        } else {
          const newUser = {
            name: inputName,
            email: inputEmail,
            password: inputPassword,
          };

          this.http.post(this.apiUrl, newUser).subscribe({
            next: (response) => {
              this.loading = false;
              console.log('Yeni istifadəçi db.json-a əlavə edildi:', response);

              this.registerSuccess = 'Qeydiyyat uğurla tamamlandı! Yönləndirilirsiniz...';
              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigateByUrl('/login');
              }, 2000);
            },
            error: (err) => {
              this.loading = false;
              this.registerError = 'Qeydiyyat zamanı xəta baş verdi.';
              this.cdr.detectChanges();
              console.error('POST Xətası:', err);
            },
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.registerError = 'Sistem xətası: İstifadəçilər yüklənə bilmədi.';
        this.cdr.detectChanges();
        console.error('GET Xətası:', err);
      },
    });
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
