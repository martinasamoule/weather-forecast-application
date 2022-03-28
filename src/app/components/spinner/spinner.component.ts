import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  timeout: boolean = false;
  selected:any='';
  constructor(private router: Router,private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params)=>
    {
      this.selected=params.get('selected');
      setTimeout(() => {
        this.timeout = true;
        this.router.navigate([`CityPage/${this.selected}`]);
      }, 3000);

    })
    
  }
}
