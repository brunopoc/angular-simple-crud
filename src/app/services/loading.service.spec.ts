import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';


describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading to true when loadingOn is called', (done) => {
    service.loading$.subscribe((loading) => {
      if (loading) {
        expect(loading).toBeTrue();
        done();
      }
    });
    service.loadingOn();
  });

  it('should set loading to false when loadingOff is called', (done) => {
    service.loadingOn(); // Set loading to true first
    service.loading$.subscribe((loading) => {
      if (!loading) {
        expect(loading).toBeFalse();
        done();
      }
    });
    service.loadingOff();
  });
});
