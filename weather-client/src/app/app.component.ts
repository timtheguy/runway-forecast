import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {switchMap, debounceTime} from 'rxjs/operators';
import {Observable} from 'rxjs'
import { WeatherService } from './weather.service';
import { AirportsService } from './airports.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Runway Forecast';
  filteredAirports: Observable<any>;
  searchForm: FormGroup;
  timeOptions: String[];
  forecast: any;

  constructor(public weather:WeatherService, public airports:AirportsService, private fb: FormBuilder){
    this.timeOptions = this.getTimeValues();
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      airportInput: null,
      dateInput: null,
      timeInput: null
    })

    this.filteredAirports = this.searchForm.get('airportInput').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.airports.search({name: value}))
      );

  }

  checkInputs(event){
    var form = this.searchForm.value;

    if(form.airportInput != null && form.dateInput != null && form.timeInput != null){
      this.getWeather(form);
    }
  }

  getWeather(values){
    var timestamp = this.createTimestamp(values.dateInput, values.timeInput.rawValue);    
    console.log(new Date(timestamp));

    this.weather.getForecast(values.airportInput, timestamp).subscribe((data: {}) => {
      console.log("Done!");
      console.log(data);
      this.forecast = data;
      console.log(this.forecast);
    });
  }

  createTimestamp(date, time){
    var timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var dateString = '' + year + '-' + month + '-' + day;
    var combined = new Date(dateString + ' ' + timeString);

    return combined;
};

  getTimeValues(){
      var todaysDate = new Date(),
      incrementDate = new Date();
      incrementDate.setHours(0,0,0,0);
      var times = [];

      while (incrementDate.getDate() == todaysDate.getDate()) {
          times.push({'displayValue':incrementDate.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}), 'rawValue': incrementDate});
          incrementDate.setMinutes(incrementDate.getMinutes() + 30);
      }
      
      return times;
  }
}
 

