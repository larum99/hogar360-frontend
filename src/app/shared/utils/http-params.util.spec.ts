import { buildPaginationParams } from './http-params.util';

describe('buildPaginationParams', () => {
    it('should return HttpParams with page and size set', () => {
        const params = buildPaginationParams(1, 10);
        expect(params.get('page')).toBe('1');
        expect(params.get('size')).toBe('10');
    });
});
