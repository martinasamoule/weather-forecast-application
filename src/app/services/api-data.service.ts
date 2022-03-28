import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApiDataService {
  constructor(private httpClient: HttpClient) {}

  getWeatherForCity(cityName: string): Observable<any> {
    return this.httpClient.get(`${environment.APIURL}${cityName}&format=json`);
  }
  getWeatherForLocation(latitude: number, longitude: number): Observable<any> {
    return this.httpClient.get(
      `${environment.APIURL}${latitude},${longitude}&includelocation=yes&format=json`
    );
  }
}
