import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-modal-in">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-600 text-center mb-6">{{ message }}</p>
          
          <button 
            (click)="close.emit()"
            class="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ValidationErrorModalComponent {
  @Input() title = 'Validation Error';
  @Input() message = 'You cannot create without filling all required fields.';
  @Input() buttonText = 'OK';
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
