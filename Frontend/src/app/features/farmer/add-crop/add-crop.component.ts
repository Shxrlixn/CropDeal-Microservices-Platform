import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CropService } from '../../../core/services/crop.service';

@Component({
  selector: 'app-add-crop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-crop.component.html'
})
export class AddCropComponent {
  private cropService = inject(CropService);

  crop = {
    name: '',
    price: 0,
    farmerId: 0,
    quantity: 0
  };

  message = '';

  addCrop() {
    this.message = 'Submitting...';
    this.cropService.addCrop(this.crop as any).subscribe({
      next: () => {
        this.message = 'Crop added successfully';
        this.crop = { name: '', price: 0, farmerId: 0, quantity: 0 };
      },
      error: () => {
        this.message = 'Backend not running';
      }
    });
  }
}
