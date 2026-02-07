import { Pipe, PipeTransform } from '@angular/core';

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