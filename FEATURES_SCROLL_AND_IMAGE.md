# Default Image and Scroll-to-Top Features

## ✅ Features Implemented

### 1. Default Product Image Pipe

**Created:** `src/app/pipes/default-image.pipe.ts`

**Features:**
- Automatically shows "No Photo" placeholder when product image is missing or empty
- Works with null, undefined, or empty string image URLs
- Clean gray background with "No Photo" text
- Reusable pipe that can be applied to any image

**Usage:**
```html
<img [src]="product.imageUrl | defaultImage" [alt]="product.name">
```

**Applied to:**
- ✅ Shops listing page product cards
- ✅ Shop detail page products
- ✅ Product detail page (main image and related products)
- ✅ Favorites page
- ✅ Admin products page

### 2. Scroll-to-Top Button

**Created:** `src/app/components/scroll-to-top/scroll-to-top.component.ts`

**Features:**
- Appears when user scrolls down more than 300px
- Smooth fade-in/out transition
- Blue circular button with white up arrow
- Positioned bottom-right corner (8px from edges)
- Hover effects: scale up and shadow increase
- Smooth scroll to top when clicked
- Z-index 50 to stay above all content

**Visual States:**
- **Hidden:** When at top of page (opacity: 0, translate-y: 10px)
- **Visible:** When scrolled down (opacity: 1, translate-y: 0)
- **Hover:** Scales up 10% and increases shadow

**Implementation:**
- Added to root app component
- Listens to window scroll events
- Smooth scroll behavior with CSS transitions

## 📁 Files Modified

### New Files:
1. `src/app/pipes/default-image.pipe.ts` - Default image pipe
2. `src/app/components/scroll-to-top/scroll-to-top.component.ts` - Scroll to top button

### Modified Files:
1. `src/app/app.ts` - Added ScrollToTopComponent import
2. `src/app/app.html` - Added scroll-to-top component to template
3. `src/app/pages/shops/shops.component.ts` - Added DefaultImagePipe import
4. `src/app/pages/shops/shops.component.html` - Applied default image pipe
5. `src/app/pages/shops/shop-detail/shop-detail.component.ts` - Added DefaultImagePipe import
6. `src/app/pages/shops/shop-detail/shop-detail.component.html` - Applied default image pipe
7. `src/app/pages/shops/product-detail/product-detail.component.ts` - Added DefaultImagePipe import
8. `src/app/pages/shops/product-detail/product-detail.component.html` - Applied default image pipe
9. `src/app/pages/favorites/favorites.component.ts` - Added DefaultImagePipe import
10. `src/app/pages/favorites/favorites.component.html` - Applied default image pipe
11. `src/app/pages/admin/products/admin-products.component.ts` - Added DefaultImagePipe import
12. `src/app/pages/admin/products/admin-products.component.html` - Applied default image pipe

## 🎨 Visual Design

### Default Image Placeholder:
- **Size:** 600x400 pixels (responsive)
- **Background:** Light gray (#e5e7eb)
- **Text Color:** Gray (#9ca3af)
- **Text:** "No Photo"
- **Font:** System default
- **Border:** None (clean minimal look)

### Scroll-to-Top Button:
- **Size:** 56x56 pixels (w-14 h-14)
- **Background:** Blue (#2563eb)
- **Icon:** White up arrow (24x24)
- **Border Radius:** Full circle (rounded-full)
- **Shadow:** Large shadow (shadow-lg)
- **Position:** Fixed bottom-right (bottom-8 right-8)
- **Z-Index:** 50 (above all content)
- **Transition:** 300ms smooth animation

## 🚀 How to Use

### Default Image:
The pipe automatically applies to all product images. No action needed.

**Example scenarios:**
- Product with no image → Shows "No Photo" placeholder
- Product with empty string image → Shows "No Photo" placeholder
- Product with valid image → Shows actual image

### Scroll-to-Top:
1. Scroll down any page more than 300 pixels
2. Blue circular button appears in bottom-right corner
3. Click the button to smoothly scroll to top
4. Button fades out when back at top

## ✨ Behavior

### Default Image Pipe:
- Checks if imageUrl is null, undefined, or empty string
- Returns placeholder image if any condition is true
- Returns original URL if image exists
- Works reactively with Angular change detection

### Scroll-to-Top Button:
- **Show threshold:** 300px scroll position
- **Animation:** Smooth fade and translate
- **Click action:** window.scrollTo({ top: 0, behavior: 'smooth' })
- **Performance:** Uses HostListener for scroll events
- **Responsive:** Fixed position works on all screen sizes

## 🔧 Technical Details

### DefaultImagePipe:
```typescript
@Pipe({
  name: 'defaultImage',
  standalone: true
})
export class DefaultImagePipe implements PipeTransform {
  private readonly defaultImage = 'https://placehold.co/600x400/e5e7eb/9ca3af?text=No+Photo';
  
  transform(imageUrl: string | null | undefined): string {
    if (!imageUrl || imageUrl.trim() === '') {
      return this.defaultImage;
    }
    return imageUrl;
  }
}
```

### ScrollToTopComponent:
```typescript
@Component({
  selector: 'app-scroll-to-top',
  // ... template with conditional visibility
})
export class ScrollToTopComponent {
  isVisible = false;
  private readonly scrollThreshold = 300;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || 
      document.documentElement.scrollTop || 
      document.body.scrollTop || 0;
    this.isVisible = scrollPosition > this.scrollThreshold;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
```

## 🎯 Testing

1. **Default Image:**
   - Visit a product with missing image
   - Should show "No Photo" placeholder
   - Check on shops page, shop detail, product detail, favorites

2. **Scroll-to-Top:**
   - Scroll down any page
   - Button should appear after 300px
   - Click button - should smoothly scroll to top
   - Button should disappear at top
   - Test on mobile and desktop

## ✅ All Requirements Met

✅ Default product image when image is missing
✅ Shows "No Photo" placeholder
✅ Scroll-to-top button appears when scrolling down
✅ Smooth transition for button appearance
✅ Smooth scroll to top when clicked
✅ Consistent with existing UI design
✅ Responsive on all screen sizes
✅ No current routing or pages broken