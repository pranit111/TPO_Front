import { Injectable } from '@angular/core';
import Cropper from 'cropperjs';

@Injectable({
  providedIn: 'root'
})
export class CropperService {
  private cropper!: Cropper;
  private imageElement!: HTMLImageElement;

  constructor() {}

  // Initialize Cropper.js on an image element
  initializeCropper(imageElement: HTMLImageElement, aspectRatio: number = 1): void {
    this.imageElement = imageElement;
    this.cropper = new Cropper(this.imageElement, {
      aspectRatio: aspectRatio, // Default to square crop
      viewMode: 2,
      autoCropArea: 10,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
    });
  }

  // Crop and return the image as a Blob
  cropImage(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.cropper) {
        reject('Cropper is not initialized.');
        return;
      }
  
      const croppedCanvas = this.cropper.getCroppedCanvas();
      if (!croppedCanvas) {
        reject('Failed to get cropped canvas.');
        return;
      }
  
      croppedCanvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject('Failed to crop image.');
      }, 'image/jpeg');
    });
  }
  

  // Destroy cropper instance
  destroyCropper(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }
  }
}
