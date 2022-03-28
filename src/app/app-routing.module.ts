import { CityPageComponent } from "./components/city-page/city-page.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { CityComponent } from "./components/city/city.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./components/not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: CityComponent,
    children: [
      {
        path: "Spinner/:selected",
        component: SpinnerComponent
      },
      { path: "CityPage/:selected", component: CityPageComponent }
    ]
  },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
