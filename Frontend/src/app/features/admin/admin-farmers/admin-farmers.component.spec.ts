import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFarmersComponent } from './admin-farmers.component';
import { FarmerService } from '../../../core/services/farmer.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AdminFarmersComponent', () => {
  let component: AdminFarmersComponent;
  let fixture: ComponentFixture<AdminFarmersComponent>;
  let farmerServiceSpy: jasmine.SpyObj<FarmerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FarmerService', ['getAllFarmers', 'updateFarmer']);
    spy.farmers$ = of([]); // Add missing observable property

    await TestBed.configureTestingModule({
      imports: [AdminFarmersComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: FarmerService, useValue: spy }
      ]
    }).compileComponents();

    farmerServiceSpy = TestBed.inject(FarmerService) as jasmine.SpyObj<FarmerService>;
    farmerServiceSpy.getAllFarmers.and.returnValue(of([]));
    farmerServiceSpy.farmers$ = of([]); // Ensure it's set on the injected instance too
    
    fixture = TestBed.createComponent(AdminFarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load farmers on init', () => {
    const mockData = [{ id: 1, firstName: 'Test' }];
    farmerServiceSpy.getAllFarmers.and.returnValue(of(mockData));
    
    component.loadFarmers();
    
    expect(component.farmers.length).toBe(1);
    expect(component.farmers[0].firstName).toBe('Test');
    expect(farmerServiceSpy.getAllFarmers).toHaveBeenCalled();
  });

  it('should open edit modal', () => {
    const farmer = { id: 1, firstName: 'John' } as any;
    component.openEditModal(farmer);
    expect(component.showEditModal).toBeTrue();
    expect(component.editForm.value.firstName).toBe('John');
  });

  it('should close modal', () => {
    component.showEditModal = true;
    component.closeModal();
    expect(component.showEditModal).toBeFalse();
  });
});
