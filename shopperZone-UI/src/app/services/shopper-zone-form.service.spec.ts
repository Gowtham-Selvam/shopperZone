import { TestBed } from '@angular/core/testing';

import { ShopperZoneFormService } from './shopper-zone-form.service';

describe('ShopperZoneFormService', () => {
  let service: ShopperZoneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopperZoneFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
