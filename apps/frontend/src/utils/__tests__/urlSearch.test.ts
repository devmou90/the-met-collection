import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getInitialSearchParams, updateSearchParams } from '../urlSearch';

let replaceStateSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  window.history.replaceState(null, '', '/explore');
  if (replaceStateSpy) {
    replaceStateSpy.mockRestore();
  }
  replaceStateSpy = vi.spyOn(window.history, 'replaceState');
});

describe('getInitialSearchParams', () => {
  it('reads query and department from the URL', () => {
    window.history.replaceState(
      null,
      '',
      '/explore?q=  Monet  &departmentId=5'
    );

    const params = getInitialSearchParams();

    expect(params).toEqual({ query: 'Monet', departmentId: 5 });
  });

  it('ignores invalid department ids', () => {
    window.history.replaceState(
      null,
      '',
      '/explore?q=Met&departmentId=not-a-number'
    );

    const params = getInitialSearchParams();

    expect(params).toEqual({ query: 'Met', departmentId: null });
  });
});

describe('updateSearchParams', () => {
  it('updates the browser URL with provided params', () => {
    updateSearchParams({ query: 'van gogh', departmentId: 4 });

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      '/explore?q=van+gogh&departmentId=4'
    );
  });

  it('removes params when values are empty', () => {
    window.history.replaceState(null, '', '/explore?q=old&departmentId=3');
    replaceStateSpy.mockClear();

    updateSearchParams({ query: '', departmentId: null });

    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/explore');
  });
});
