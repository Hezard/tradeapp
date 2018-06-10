import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class ApiService {
  formatErrors  = this._formatErrors();

  constructor(private http: HttpClient) { }

  private _formatErrors() {
    return function(response: HttpErrorResponse) {
      console.error(response);
      return Observable.throw(response);
    };
  }

  get<T>(path: string, params?): Observable<T> {
    const httpParams = new HttpParams({fromObject: params});
    return this.http.get<T>(
        `${environment.ENDPOINT}${path}`,
        { headers, params: httpParams }
      )
      .pipe(
        catchError(this.formatErrors)
      );
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.put<T>(
        `${environment.ENDPOINT}${path}`,
        JSON.stringify(body),
        { headers }
      )
      .pipe(
        catchError(this.formatErrors)
      );
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(
        `${environment.ENDPOINT}${path}`,
        JSON.stringify(body),
        { headers }
      )
      .pipe(
        catchError(this.formatErrors)
      );
  }

  delete<T>(path): Observable<T> {
    return this.http.delete<T>(
        `${environment.ENDPOINT}${path}`,
        { headers }
      )
      .pipe(
        catchError(this.formatErrors)
      );
  }
}
