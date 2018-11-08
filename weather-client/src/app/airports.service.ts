import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

var endpoint = "http://gd.geobytes.com/AutoCompleteCity?q=";

@Injectable({
  providedIn: 'root'
})
export class AirportsService {

  constructor(private http: HttpClient) {}

  search(filter: {name: string} = {name: ''}): Observable< any > {
    return this.http.get(endpoint + filter.name)
    .pipe(
      tap((response) => {
        console.log('resp: ', response);
        response = {values: response};
        return response;
      })
      );
  }
}