import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-in">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {{ getInitials() }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <p class="text-sm text-gray-500">Update your personal information</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Success Message -->
        <div *ngIf="successMessage" class="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fade-in">
          <svg class="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm text-green-800">{{ successMessage }}</span>
        </div>
        
        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fade-in">
          <svg class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm text-red-800">{{ errorMessage }}</span>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              [(ngModel)]="formData.name" 
              name="name" 
              required
              placeholder="Enter your full name"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              [class.border-red-300]="errors['name']"
            >
            <p *ngIf="errors['name']" class="text-xs text-red-600 mt-1">{{ errors['name'] }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              [(ngModel)]="formData.email" 
              name="email" 
              required
              placeholder="Enter your email address"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              [class.border-red-300]="errors['email']"
            >
            <p *ngIf="errors['email']" class="text-xs text-red-600 mt-1">{{ errors['email'] }}</p>
          </div>
          

          <div class="border-t border-gray-200 pt-5">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Change Password</h4>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <div class="relative">
                <input 
                  [type]="showCurrentPassword ? 'text' : 'password'"
                  [(ngModel)]="formData.currentPassword" 
                  name="currentPassword"
                  placeholder="Enter current password"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                >
                <button 
                  type="button"
                  (click)="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg *ngIf="!showCurrentPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showCurrentPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div class="relative">
                <input 
                  [type]="showNewPassword ? 'text' : 'password'"
                  [(ngModel)]="formData.newPassword" 
                  name="newPassword"
                  placeholder="Enter new password (min 6 characters)"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  [class.border-red-300]="errors['newPassword']"
                >
                <button 
                  type="button"
                  (click)="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg *ngIf="!showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <p *ngIf="errors['newPassword']" class="text-xs text-red-600 mt-1">{{ errors['newPassword'] }}</p>
              <p *ngIf="formData.newPassword && !errors['newPassword']" class="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div class="relative">
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [(ngModel)]="formData.confirmPassword" 
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  [class.border-red-300]="errors['confirmPassword']"
                >
                <button 
                  type="button"
                  (click)="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg *ngIf="!showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <p *ngIf="errors['confirmPassword']" class="text-xs text-red-600 mt-1">{{ errors['confirmPassword'] }}</p>
            </div>
          </div>
          
          <div class="flex gap-3 pt-2">
            <button 
              type="button" 
              (click)="close.emit()"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="isLoading"
              class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg *ngIf="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
          
          <div class="border-t border-gray-200 pt-5 mt-5">
            <button 
              type="button"
              (click)="showDeleteConfirm = true"
              class="w-full px-4 py-2.5 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Delete Account
            </button>
            <p class="text-xs text-gray-500 text-center mt-2">This action cannot be undone</p>
          </div>
        </form>
      </div>
    </div>

    <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in" (click)="onDeleteBackdropClick($event)">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-modal-in">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">Delete Account?</h3>
          <p class="text-sm text-gray-600 text-center mb-4">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
          

          <div *ngIf="deleteError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-800">{{ deleteError }}</span>
          </div>
          
          <div class="flex gap-3">
            <button 
              (click)="showDeleteConfirm = false; deleteError = ''"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              (click)="confirmDelete()"
              [disabled]="isDeleting"
              class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg *ngIf="isDeleting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  formData = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  errors: Record<string, string> = {};
  successMessage = '';
  errorMessage = '';
  isLoading = false;
  showDeleteConfirm = false;
  isDeleting = false;
  deleteError = '';
  
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.user();
    if (user) {
      this.formData.name = user.name;
      this.formData.email = user.email;
    }
  }

  getInitials(): string {
    const user = this.userService.user();
    if (!user || !user.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;


    if (!this.formData.name.trim()) {
      this.errors['name'] = 'Full name is required';
      isValid = false;
    } else if (this.formData.name.trim().length < 2) {
      this.errors['name'] = 'Name must be at least 2 characters';
      isValid = false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email.trim()) {
      this.errors['email'] = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(this.formData.email)) {
      this.errors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    if (this.formData.newPassword || this.formData.currentPassword || this.formData.confirmPassword) {
      if (!this.formData.currentPassword) {
        this.errors['currentPassword'] = 'Current password is required to change password';
        isValid = false;
      }

      if (!this.formData.newPassword) {
        this.errors['newPassword'] = 'New password is required';
        isValid = false;
      } else if (this.formData.newPassword.length < 6) {
        this.errors['newPassword'] = 'Password must be at least 6 characters';
        isValid = false;
      }

      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.errors['confirmPassword'] = 'Passwords do not match';
        isValid = false;
      }
    }

    return isValid;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const updates: Partial<User> = {
        name: this.formData.name.trim(),
        email: this.formData.email.trim()
      };

      const success = this.userService.updateUser(updates);

      if (success) {
        if (this.formData.newPassword) {
          const passwordUpdated = this.userService.updatePassword(
            this.formData.currentPassword,
            this.formData.newPassword
          );
          
          if (!passwordUpdated) {
            this.errorMessage = 'Failed to update password. Please check your current password.';
            this.isLoading = false;
            return;
          }
        }

        this.successMessage = 'Profile updated successfully!';
        this.saved.emit();

        this.formData.currentPassword = '';
        this.formData.newPassword = '';
        this.formData.confirmPassword = '';

        setTimeout(() => {
          this.close.emit();
        }, 1500);
      } else {
        this.errorMessage = 'Failed to update profile. Please try again.';
      }

      this.isLoading = false;
    }, 800);
  }

  confirmDelete(): void {
    this.deleteError = '';
    this.isDeleting = true;

    setTimeout(() => {
      const success = this.userService.deleteAccount();
      
      if (success) {
        this.deleted.emit();
        this.close.emit();
      } else {
        this.deleteError = 'Failed to delete account. Please try again.';
        this.isDeleting = false;
      }
    }, 1000);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onDeleteBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showDeleteConfirm = false;
      this.deleteError = '';
    }
  }
}
