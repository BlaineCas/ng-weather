import { LocationService } from './location.service';
import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { CachingService } from './caching.service';

@Injectable()
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  static CACHE_TTL = 7200;
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private locationService: LocationService, private cachingService: CachingService) {
    let locations = this.locationService.getLocations();
    for (let loc of locations()) {
      if (loc.length > 0) {
        this.updateCurrentConditions(loc);
      }
    }
  }

  updateCurrentConditions(zipcode: string): void {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    const URL = this.createCurrentConditionsURL(zipcode);
    this.cachingService.get(URL, WeatherService.CACHE_TTL).subscribe(
      (data) => this.currentConditions.update((conditions) => [...conditions, { zip: zipcode, data }]),
      (error) => console.log(`Error: ${error}`)
    );
  }

  addCurrentConditions(zipcode: string): void {
    this.updateCurrentConditions(zipcode);
    this.locationService.addLocation(zipcode);
  }

  removeCurrentConditions(zipcode: string): void {
    this.locationService.removeLocation(zipcode);
    this.cachingService.remove(this.createCurrentConditionsURL(zipcode));
    this.cachingService.remove(this.createForecastURL(zipcode));

    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) {
          conditions.splice(+i, 1);
          break;
        }
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    const URL = this.createForecastURL(zipcode);
    return this.cachingService.get(URL, WeatherService.CACHE_TTL);
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }

  private createCurrentConditionsURL(zipcode: string): string {
    return `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
  }

  private createForecastURL(zipcode: string): string {
    return `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
  }
}
