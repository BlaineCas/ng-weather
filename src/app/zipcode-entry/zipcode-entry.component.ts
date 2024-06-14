import { WeatherService } from './../weather.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private weatherService : WeatherService) { }

  addLocation(zipcode : string){
    this.weatherService.addCurrentConditions(zipcode);
  }

}
