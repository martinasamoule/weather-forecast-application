import { Component, OnInit } from "@angular/core";
import { ApiDataService } from "src/app/services/api-data.service";
import * as d3 from "d3";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-city-page",
  templateUrl: "./city-page.component.html",
  styleUrls: ["./city-page.component.scss"]
})
export class CityPageComponent implements OnInit {
  selected: any = "";
  dataArray: any = [];
  svg: any;
  margin = 50;
  width = 880 - this.margin * 2;
  height = 750 - this.margin * 2;
  currentCityTempreter: any = "";
  currentCityImage: any = "";
  weeklyTempretere: any[] = [];
  windArray: any[] = [];
  pressure: number = 0;
  visibility: number = 0;
  weatherDesc: string = "";

  constructor(
    private dataService: ApiDataService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createSvg();
    this.activeRoute.paramMap.subscribe(params => {
      this.selected = params.get("selected");
      this.dataService.getWeatherForCity(this.selected).subscribe(response => {
        this.dataArray = response.data.ClimateAverages[0].month;
        for (let i = 0; i < 8; i++) {
          this.windArray.push(
            response.data.weather[0].hourly[i].windspeedMiles
          );
        }
        this.drawBars(this.dataArray);
        this.currentCityTempreter = response.data.current_condition[0].temp_C;
        this.pressure = response.data.current_condition[0].pressure;
        this.visibility = response.data.current_condition[0].visibility;
        this.weatherDesc =
          response.data.current_condition[0].weatherDesc[0].value;
        this.currentCityImage =
          response.data.current_condition[0].weatherIconUrl[0].value;
        for (let i = 0; i < 3; i++) {
          this.weeklyTempretere.push({
            date: new Date(
              response.data.weather[i].date
            ).toLocaleDateString("en", { weekday: "long" }),
            morningTemp: response.data.weather[i].hourly[0].tempC,
            nightTemp: response.data.weather[i].hourly[7].tempC,
            image: response.data.weather[i].hourly[4].weatherIconUrl[0].value
          });
        }
      });
    });
  }

  createSvg(): void {
    this.svg = d3
      .select("figure#bar")
      .append("svg")
      .attr("height", this.height + this.margin * 2)
      .attr("width", this.width + this.margin * 2)
      .append("g")
      .attr("id", "barChart")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }
  drawBars(data: any[]): void {
    // Create the X-axis band scale
    const y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(data.map(d => d.name))
      .padding(0.2);

    const text = d3
      .scaleBand()
      .range([0.7, this.height + 0.9])
      .domain(data.map(d => d.name))
      .padding(0.8);

    // Create the Y-axis band scale
    const x = d3.scaleLinear().domain([30, 0]).range([this.width, 0]);

    // Draw the Y-axis on the DOM
    this.svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("transform", "translate(-5,0)rotate(-45)")
      .style("text-anchor", "end");

    // Draw the X-axis on the DOM
    this.svg
      .append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    // Add text to chart
    this.svg
      .append("text")
      .attr(
        "transform",
        "translate(" + this.width / 2 + " ," + (this.height + 40) + ")"
      )
      .attr("class", "fs-5")
      .style("text-anchor", "middle")
      .text("Tempretere (°C)");

    this.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(this.height / 2))
      .attr("y", -37)
      .attr("class", "fs-5")
      .style("text-anchor", "middle")
      .text("Month");

    var texts = this.svg
      .selectAll(".myTexts")
      .data(data)
      .enter()
      .append("text");

    texts
      .data(data)
      .attr("x", (d: any) => {
        return x(d.avgMinTemp) + 10;
      })
      .attr("y", (d: any) => text(d.name))
      .text(function(d: any) {
        return d.avgMinTemp;
      });

    // Create and fill the bars
    this.svg
      .selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0.7)
      .attr("y", (d: any) => y(d.name))
      .attr("height", y.bandwidth())
      .attr("width", (d: any) => x(d.avgMinTemp))
      .attr("fill", "#1b92c9");
  }
}
