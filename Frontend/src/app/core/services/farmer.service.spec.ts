import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FarmerService } from './farmer.service';
import { environment } from '../../../environments/environment';

describe('FarmerService', () => {
  let service: FarmerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FarmerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(FarmerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all farmers', () => {
    const mockRes = { data: [{ id: 1, firstName: 'John' }] };
    
    service.getAllFarmers().subscribe(res => {
      expect(Array.isArray(res)).toBeTrue();
      expect(res.length).toBe(1);
      expect(res[0].firstName).toBe('John');
    });

    const req = httpMock.expectOne(`${environment.apiGateway}/farmer/api/v1/admin/farmers`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRes);
  });

  it('should update a farmer', () => {
    const mockFarmer = { id: 1, firstName: 'Updated' } as any;
    
    service.updateFarmer(1, mockFarmer).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiGateway}/farmer/api/v1/admin/farmers/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });

    // Handle the refresh request triggered by tap()
    const refreshReq = httpMock.expectOne(`${environment.apiGateway}/farmer/api/v1/admin/farmers`);
    expect(refreshReq.request.method).toBe('GET');
    refreshReq.flush({ data: [] });
  });
});
