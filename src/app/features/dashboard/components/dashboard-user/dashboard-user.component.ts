import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title?: ApexTitleSubtitle;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
};

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})
export class DashboardUserComponent {
  cpuChart: ChartOptions = {
    series: [
      {
        name: 'CPU Usage',
        data: [20, 40, 35, 50, 49, 60, 70]
      }
    ],
    chart: {
      height: 300,
      type: 'line'
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  burndownChart: ChartOptions = {
    series: [
      {
        name: 'Remaining Tasks',
        data: [50, 45, 40, 32, 20, 12, 5]
      }
    ],
    chart: {
      height: 300,
      type: 'area'
    },
    xaxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
    }
  };

  incidentChart: ChartOptions = {
    series: [
      {
        name: 'Critical',
        data: [3, 1, 0, 2, 4, 1, 0]
      },
      {
        name: 'High',
        data: [2, 3, 1, 2, 1, 1, 0]
      },
      {
        name: 'Medium',
        data: [4, 2, 3, 3, 2, 2, 1]
      },
      {
        name: 'Low',
        data: [1, 1, 2, 0, 2, 3, 2]
      }
    ],
    chart: {
      type: 'bar',
      height: 300,
      stacked: true
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    }
  };

  constructor() {
    console.log('DashboardUserComponent initialized');
  }
}
