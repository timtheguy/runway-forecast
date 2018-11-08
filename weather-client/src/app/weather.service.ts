import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'http://localhost:8000/api/weather/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {}

  getForecast(destination, timestamp): Observable < any > {
    return this.getWeather(destination).pipe(
      map((response) => {
        var timestampToSearch = new Date(timestamp).getTime() / 1000;
        var forecastResponse = null;
        var elements = response.list;
        
        for(let forecastItem of elements) {
          if(forecastItem.dt > timestampToSearch){
            forecastResponse = forecastItem; 
            break;
          }
        };

        return forecastResponse;
      })
    );
  }

  getWeather(destination): Observable<any> {
    console.log("Searching " + destination);
    return this.http.get(endpoint + destination);
  }

  private extractForecastForTime(res){
    let body = res;

    return body || { };
  }
}
