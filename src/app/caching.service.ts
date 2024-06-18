import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CachingService {

  constructor(private http: HttpClient) {}

    /**
   * Retrieves data from the cache if it exists and has not expired, otherwise makes a request to the server and caches the response.
   *
   * @param url - The URL to retrieve data from.
   * @param ttl - The time-to-live for the cached data in seconds. Defaults to 1 hour.
   * @return An observable that emits the cached data if it exists and has not expired, otherwise emits the data retrieved from the server.
   */
  get(url: string, ttl = 3600): Observable<any> {
    const nowDate = new Date().getTime();
    const data = localStorage.getItem(url);

    if (data) {
      const dataObj = JSON.parse(data);
      if (dataObj.ttl > nowDate) {
        return of(dataObj.data);
      }
    }

    localStorage.removeItem(url);
    return this.http.get(url).pipe(tap((data) => this.setCache(url, data, ttl)));
  }

    /**
   * Removes the item with the specified URL from the local storage.
   *
   * @param url - The URL of the item to be removed.
   * @return This function does not return anything.
   */
  remove(url: string) {
    localStorage.removeItem(url);
  }


  private setCache(url: string, data: any, ttl = 3600) {
    const nowDate = new Date().getTime();
    const cacheExpirationDate = nowDate + (ttl * 1000); //Convert seconds to milliseconds
    localStorage.setItem(url, JSON.stringify({ data, ttl: cacheExpirationDate }));
  }
}
