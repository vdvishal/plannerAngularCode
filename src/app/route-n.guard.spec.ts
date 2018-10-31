import { TestBed, async, inject } from '@angular/core/testing';

import { RouteNGuard } from './route-n.guard';

describe('RouteNGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteNGuard]
    });
  });

  it('should ...', inject([RouteNGuard], (guard: RouteNGuard) => {
    expect(guard).toBeTruthy();
  }));
});
