import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

/**
 * Session D3 dashboard.
 */
@Component({
  selector: 'tm-session-dashboard',
  templateUrl: './session-dashboard.component.html',
  styleUrls: ['./session-dashboard.component.scss'],
})
export class SessionDashboardComponent implements OnInit {

  @Input() data: any[] = [];
  // @Input() barId: string = '';

  private margin: number = 40;
  private width: number = 750 - (this.margin * 2);
  private height: number = 300 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.drawBars(this.data);
  }

  private drawBars(data: any[]): void {
    let svg: any;

    svg = d3.selectAll('.bar')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      // tslint:disable-next-line
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');

    // Create the X-axis band scale
    const x: any = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map((d: any) => d.time))
      .padding(0.2);

    // Draw the X-axis on the DOM
    svg.append('g')
      // tslint:disable-next-line
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y: any = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    svg.append('g')
    .call(d3.axisLeft(y));

    // Create and fill the bars
    svg.selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.time))
      .attr('y', (d: any) => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.total))
      .attr('fill', '#d04a35');
  }

//   private dataHandler(data: any) {
//     var today = new Date();
//     today.setHours(0, 0, 0, 0);
//     var todayMillis = today.getTime();
//
//     data.forEach((d: any) => {
//       var parts = d.time.split(/:/);
//       var timePeriodMillis = (parseInt(parts[0], 10) * 60 * 60 * 1000) +
//                              (parseInt(parts[1], 10) * 60 * 1000) +
//                              (parseInt(parts[2], 10) * 1000);
//
//       d.time = new Date();
//       d.time.setTime(todayMillis + timePeriodMillis);
//     });
//
//     return data;
//   }
}
