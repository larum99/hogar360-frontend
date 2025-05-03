import { HttpParams } from '@angular/common/http';

export function buildPaginationParams(page: number, size: number): HttpParams {
    return new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
}
