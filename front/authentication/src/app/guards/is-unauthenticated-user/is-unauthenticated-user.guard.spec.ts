import { TestBed } from '@angular/core/testing';

import { IsUnauthenticatedUserGuard } from './is-unauthenticated-user.guard';

describe('IsUnauthenticatedUserGuard', () => {
  let guard: IsUnauthenticatedUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsUnauthenticatedUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
