import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropService } from '../../../core/services/crop.service';

@Component({
  selector: 'app-view-crops',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-crops.component.html'
})
export class ViewCropsComponent {
  private cropService = inject(CropService);

  crops: any[] = [];
  message = '';

  loadCrops() {
    this.message = 'Loading...';
    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.crops = data || [];
        if (this.crops.length === 0) {
          this.message = 'No crops found';
        } else {
          this.message = '';
        }
      },
      error: () => {
        this.crops = [];
        this.message = 'Backend not running';
      }
    });
  }
}
