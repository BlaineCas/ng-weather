import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {
  private locations: WritableSignal<string[]> = signal<string[]>([]);

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations.set(JSON.parse(locString));
    }
  }

  getLocations(): Signal<string[]> {
    return this.locations.asReadonly();
  }

  addLocation(zipcode: string): Signal<string[]> {
    this.locations.update((locations) => {
      locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(locations));

      return locations;
    });

    return this.locations.asReadonly();
  }

  removeLocation(zipcode: string): Signal<string[]> {
    this.locations.update((locations) => {
      let index = locations.indexOf(zipcode);
      if (index !== -1) {
        locations.splice(index, 1);
        localStorage.setItem(LOCATIONS, JSON.stringify(locations));
      }

      return locations;
    });

    return this.locations.asReadonly();
  }
}
