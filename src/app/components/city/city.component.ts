import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiDataService } from "src/app/services/api-data.service";

@Component({
  selector: "app-city",
  templateUrl: "./city.component.html",
  styleUrls: ["./city.component.scss"]
})
export class CityComponent implements OnInit {
  dataArray: any[] = [];
  selected: any = "";
  citiesArray: any[] = [];
  citiesArrayUs: any[] = [];
  citiesArrayEgypt: any[] = [];
  citiesTempreters: string[] = [];
  weeklyTempretere: any[] = [];
  currentCityTempreter: any = "";
  currentCityImage: any = "";
  location: string = "";
  show: boolean = false;
  chooseCity: boolean = false;
  pressure: number = 0;
  visibility: number = 0;
  weatherDesc: string = "";
  spinnerShow: boolean = true;

  constructor(private dataService: ApiDataService, private router: Router) {
    this.citiesArrayUs = [
      { name: "London", temp: "" },
      { name: "Brighton", temp: "" },
      { name: "Cardiff", temp: "" },
      { name: "Edinburgh", temp: "" },
      { name: "Leeds", temp: "" },
      { name: "Glasgow", temp: "" },
      { name: "Manchester", temp: "" }
    ];
    this.citiesArrayEgypt = [
      { name: "Cairo", temp: "" },
      { name: "Alexandria", temp: "" },
      { name: "Luxor", temp: "" },
      { name: "Aswan", temp: "" },
      { name: "Suez", temp: "" },
      { name: "Hurghada", temp: "" }
    ];
    this.citiesArray = this.citiesArrayUs;
  }

  ngOnInit(): void {
    this.GetCurrenCityWeather();
    this.GetTempreters(this.citiesArrayUs);
  }
  ShowDetails() {
    this.router.navigate([`/Spinner/${this.selected}`]);
  }

  GetTempreters(citiesArray: any[]) {
    for (let i = 0; i < citiesArray.length; i++) {
      this.dataService
        .getWeatherForCity(citiesArray[i].name)
        .subscribe(response => {
          citiesArray[i].temp = response.data.current_condition[0].temp_C;
        });
    }
  }

  GetCurrenCityWeather() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.dataService
          .getWeatherForLocation(latitude, longitude)
          .subscribe(response => {
            this.currentCityTempreter =
              response.data.current_condition[0].temp_C;
            this.pressure = response.data.current_condition[0].pressure;
            this.visibility = response.data.current_condition[0].visibility;
            this.weatherDesc =
              response.data.current_condition[0].weatherDesc[0].value;
            this.currentCityImage =
              response.data.current_condition[0].weatherIconUrl[0].value;
            this.location = `${response.data.nearest_area[0].region[0]
              .value} / ${response.data.nearest_area[0].country[0].value} `;
            response.data.nearest_area[0].country[0].value == "Egypt"
              ? (this.citiesArray = this.citiesArrayEgypt)
              : (this.citiesArray = this.citiesArrayUs);
            response.data.nearest_area[0].country[0].value == "Egypt"
              ? this.GetTempreters(this.citiesArrayEgypt)
              : this.GetTempreters(this.citiesArrayUs);
            for (let i = 0; i < 3; i++) {
              this.weeklyTempretere.push({
                date: new Date(
                  response.data.weather[i].date
                ).toLocaleDateString("en", { weekday: "long" }),
                morningTemp: response.data.weather[i].hourly[0].tempC,
                nightTemp: response.data.weather[i].hourly[7].tempC,
                image:
                  response.data.weather[i].hourly[4].weatherIconUrl[0].value
              });
            }
            setTimeout(() => {
              this.spinnerShow = false;
            }, 3000);
          });
      },
      () => {
        this.chooseCity = true;
        this.citiesArray = this.citiesArrayUs;
        this.spinnerShow = false;
      }
    );
  }
}
