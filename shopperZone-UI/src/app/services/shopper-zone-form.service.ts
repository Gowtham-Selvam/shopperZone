import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopperZoneFormService {
  data = [];
  endPoint = environment.shopperZone;

  constructor(private httpClient: HttpClient) {}

  getCreditCardMonth(month?: number): Observable<number[]> {
    for (let i = month || 1; i <= 12; i++) {
      this.data.push(i);
    }
    return of(this.data);
  }

  getCreditCardYear(): Observable<number[]> {
    let yearArray = [];
    const startYear = new Date().getFullYear();
    const endYear = new Date().getFullYear() + 10;

    for (let i = startYear; i <= endYear; i++) {
      yearArray.push(i);
    }

    return of(yearArray);
  }

  getCountriesList(): Observable<Country[]> {
    const baseUrl = this.endPoint + '/countries';
    return this.httpClient
      .get<CountriesData>(baseUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStatesList(code: string): Observable<State[]> {
    const baseUrl =
      this.endPoint + '/states/search/findByCountryCode?code=' + code;
    return this.httpClient
      .get<StatesData>(baseUrl)
      .pipe(map((response) => response._embedded.states));
  }
}

interface CountriesData {
  _embedded: {
    countries: Country[];
  };
}

interface StatesData {
  _embedded: {
    states: State[];
  };
}
