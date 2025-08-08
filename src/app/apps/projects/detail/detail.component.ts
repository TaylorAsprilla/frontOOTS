import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { ChartjsOptions } from 'src/app/pages/charts/chartjs/chartjs.model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DUMMY_PROJECTS } from '../shared/data';
import { Project } from '../shared/projects.model';

@Component({
  selector: 'app-project-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedProject!: Project;
  projectChartOptions!: ChartjsOptions;

  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Projects', path: '/' }, { label: 'Project Details', path: '/', active: true }];

    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedProject = DUMMY_PROJECTS.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.selectedProject = DUMMY_PROJECTS[0];
      }
    });
    this.initializeChartConfig();
  }

  /**
   * initialize chart configuration
   */
  initializeChartConfig(): void {
    // Chart.defaults.global.defaultFontColor = '#8391a2';
    // Chart.defaults.global.defaultFontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell, "Helvetica Neue",sans-serif';

    this.projectChartOptions = {
      type: 'line',
      chartOptions: {
        maintainAspectRatio: false,

        hover: {
          intersect: true
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            intersect: false
          },
          filler: {
            propagate: false
          }
        },
        scales: {
          xAxes: {
            grid: {
              color: "rgba(0,0,0,0.05)"
            }
          },
          yAxes: {
            ticks: {
              stepSize: 20
            },
            display: true,
            grid: {
              color: "rgba(0,0,0,0)",
            }
          }
        }
      }
    };
  }


}
