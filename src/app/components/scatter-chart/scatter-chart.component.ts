import { Component, Input, OnInit } from "@angular/core";
import * as d3 from "d3";
import { ApiDataService } from "src/app/services/api-data.service";

@Component({
  selector: "app-scatter-chart",
  templateUrl: "./scatter-chart.component.html",
  styleUrls: ["./scatter-chart.component.scss"]
})
export class ScatterChartComponent implements OnInit {
  svg: any;
  margin = 50;
  scatterChartWidth = 880 - this.margin * 2;
  scatterChartHeight = 600 - this.margin * 2;
  @Input() selectedCity: any;
  windAirArray: any[] = [];
  constructor(private dataService: ApiDataService) {}

  ngOnInit(): void {
    this.createScatterSvg();
    this.dataService
      .getWeatherForCity(this.selectedCity)
      .subscribe(response => {
        for (let i = 0; i < 8; i++) {
          this.windAirArray.push(
            response.data.weather[0].hourly[i].windspeedMiles
          );
          console.log(response.data.weather[0].hourly[i].windspeedMiles)
        }
        this.drawScatterPlot(this.windAirArray);
      });
  }
  private createScatterSvg(): void {
    this.svg = d3
      .select("figure#scatter")
      .append("svg")
      .attr("width", this.scatterChartWidth + this.margin * 2)
      .attr("height", this.scatterChartHeight + this.margin * 2)
      .append("g")
      .attr("id", "scatterChart")
      .attr(
        "transform",
        "translate(" + this.margin + "," + this.margin / 2 + ")"
      );
  }

  private drawScatterPlot(data: any): void {
    // Add X axis
    const x = d3
      .scaleLinear()
      .domain([0, 22])
      .range([0, this.scatterChartWidth]);
    this.svg
      .append("g")
      .attr("transform", "translate(0," + this.scatterChartHeight + ")")
      .attr("id", "scatterChart")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, 26])
      .range([this.scatterChartHeight, 0]);
    this.svg.append("g").call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append("g");
    dots
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: any, index: number) => x(index * 3))
      .attr("cy", (d: any) => y(d))
      .attr("r", 7)
      .style("opacity", 0.5)
      .style("fill", "#1cc44e");

    this.svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          this.scatterChartWidth / 2 +
          " ," +
          (this.scatterChartHeight + 40) +
          ")"
      )
      .attr("class", "fs-5")
      .style("text-anchor", "middle")
      .text("Hours");

    this.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(this.scatterChartHeight / 2))
      .attr("y", -25)
      .attr("class", "fs-5")
      .style("text-anchor", "middle")
      .text("wind by miles");

    // Add labels
    dots
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d: any) => d)
      .attr("x", (d: any, index: number) => x(index * 3))
      .attr("y", (d: any) => y(d));
  }
}
