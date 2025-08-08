import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { ChartStatistics } from 'src/app/shared/widget/chart-statistics/chart-statistics.model';
import { ChatMessage } from 'src/app/shared/widget/chat/chat.model';
import { CHATMESSAGES } from 'src/app/shared/widget/chat/data';
import { INBOXMESSAGES } from 'src/app/shared/widget/inbox/data';
import { Message } from 'src/app/shared/widget/inbox/inbox.model';
import { StatisticsCard1 } from 'src/app/shared/widget/statistics-card/statistics-card.model';
import { StatisticsCard2 } from 'src/app/shared/widget/statistics-card2/statistics-card2.model';
import { StatisticsCard3 } from 'src/app/shared/widget/statistics-card3/statistics-card3.model';
import { StatisticsWidget } from 'src/app/shared/widget/statistics-widget/statistics-widget.model';
import { TODOLIST } from 'src/app/shared/widget/todo/data';
import { ToDoItem } from 'src/app/shared/widget/todo/todo.model';
import { UserCard } from 'src/app/shared/widget/user-card/user-card.model';
import { ChartOptions } from '../charts/apex/apex-chart.model';
import { STATISCTICSCARD1, STATISTICSCARD2, STATISTICSCARD3, STATISTICSWIDGETS, USERSCARDS } from './data';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  statisticsCard1: StatisticsCard1[] = [];
  statisticsCard2: StatisticsCard2[] = [];
  statisticsCard3: StatisticsCard3[] = [];
  statisticsWidgets: StatisticsWidget[] = [];
  userCards: UserCard[] = [];
  inboxMessages: Message[] = [];
  chatMessages: ChatMessage[] = [];
  todoList: ToDoItem[] = [];
  salesChart!: Partial<ChartOptions>;
  incomeChart!: Partial<ChartOptions>;
  usersChart!: Partial<ChartOptions>;
  barChart!: Partial<ChartOptions>;
  lineChart!: Partial<ChartOptions>;
  areaChart!: Partial<ChartOptions>;
  salesChartStatistics: ChartStatistics[] = [];
  incomeChartStatistics: ChartStatistics[] = [];
  userChartStatistics: ChartStatistics[] = [];



  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Components', path: '/' }, { label: 'Widgets', path: '/', active: true }];
    this._fetchData();
    this._fetchMessage();
    this._fetchChatMessage();
    this._fetchTodoList();
    this.initCharts();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.statisticsCard1 = STATISCTICSCARD1;
    this.statisticsWidgets = STATISTICSWIDGETS;
    this.statisticsCard2 = STATISTICSCARD2;
    this.statisticsCard3 = STATISTICSCARD3;
    this.userCards = USERSCARDS;
  }

  /**
 * fetch inbox messages
 */
  _fetchMessage(): void {
    this.inboxMessages = INBOXMESSAGES;
  }

  /**
   * fetches chat message
   */
  _fetchChatMessage(): void {
    this.chatMessages = CHATMESSAGES;
  }

  /**
   * fetches todo list
   */
  _fetchTodoList(): void {
    this.todoList = TODOLIST;
  }


  /**
   * initialize charts
   */
  initCharts(): void {
    this._fetchChartStatistics();

    this.salesChart =
    {
      series: [
        {
          type: 'area',
          data: [0, 23, 43, 35, 44, 45, 56, 37, 40],
        },
        {
          type: 'area',
          data: [25, 23, 26, 24, 25, 32, 30, 24, 19],
        },
      ],
      chart: {
        type: 'line',
        height: 240,
        width: "100%",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      fill: {
        type: 'solid',
        opacity: [0.3, 0.3],
      },
      colors: ['#00acc1', '#f1556c'],
      xaxis: {
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return '';
            },
          },
        },
        marker: {
          show: false,
        },
      },
    }

    this.incomeChart = {
      series: [{ data: [3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12] }],
      chart: {
        type: 'bar',
        height: 250,
        width: 250,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '65%',
        },
      },
      xaxis: {
        crosshairs: {
          width: 1,
        },
      },
      stroke: {
        width: 0,
        curve: 'smooth',
      },
      colors: ['#00acc1'],
      tooltip: {
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return '';
            },
          },
        },
        marker: {
          show: false,
        },
      },
    }

    this.usersChart = {
      series: [20, 40, 30, 10],
      chart: {
        type: 'pie',
        height: 270,
      },
      colors: ['#00acc1', '#4b88e4', '#e3eaef', '#fd7e14'],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return '';
            },
          },
        },
        marker: {
          show: false,
        },
      },
    }

    this.barChart = {
      series: [
        { data: [5, 9, 5, 7, 5, 9, 2, 3, 2, 7, 5, 9, 5, 7] },
        { data: [3, 6, 9, 3, 2, 7, 1, 5, 9, 2, 3, 6, 9] },
      ],
      chart: {
        type: 'bar',
        height: 55,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '95%',
        },
      },
      xaxis: {
        crosshairs: {
          width: 1,
        },
      },
      stroke: {
        width: 0,
        curve: 'smooth',
      },
      fill: {
        colors: ['#f7b84b', '#ebeff2'],
      },
      tooltip: {
        enabled: false,
      }
    }

    this.lineChart = {
      series: [
        { data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2], },
      ],
      chart: {
        type: 'line',
        height: 50,
        width: "100%",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      colors: ['#4a81d4'],
      xaxis: {
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      }

    }

    this.areaChart = {
      series: [
        { data: [3, 5, 2, 9, 7, 2, 5, 3, 9, 6, 5, 9, 7], },
      ],
      chart: {
        type: 'area',
        height: 50,
        width: "100%",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      fill: {
        type: 'solid',
      },
      colors: ['#1abc9c'],
      xaxis: {
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      }

    }


  }

  /**
   * fetches chart statistics data
   */
  _fetchChartStatistics(): void {
    this.salesChartStatistics = [{
      title: 'Target',
      stats: '$7.8k',
      icon: 'fe-arrow-down',
      variant: 'danger'
    },
    {
      title: 'Last week',
      stats: '$1.4k',
      icon: 'fe-arrow-up',
      variant: 'success'
    },
    {
      title: 'Last Month',
      stats: '$9.8k',
      icon: 'fe-arrow-down',
      variant: 'danger'
    }];

    this.incomeChartStatistics = [{
      title: 'Target',
      stats: '641',
      icon: 'fe-arrow-up',
      variant: 'success'
    },
    {
      title: 'Last week',
      stats: '234',
      icon: 'fe-arrow-down',
      variant: 'danger'
    },
    {
      title: 'Last Month',
      stats: '3201',
      icon: 'fe-arrow-up',
      variant: 'success'
    }];

    this.userChartStatistics = [{
      title: 'Target',
      stats: '18k',
      icon: 'fe-arrow-down',
      variant: 'danger'
    },
    {
      title: 'Last week',
      stats: '3.25k',
      icon: 'fe-arrow-up',
      variant: 'success'
    },
    {
      title: 'Last Month',
      stats: '28k',
      icon: 'fe-arrow-down',
      variant: 'danger'
    }]
  }


  /**
* adds new task in todo list
* @param newTask task to be added in list
*/
  addTask(newTask: string): void {
    const newTaskItem: ToDoItem = {
      id: this.todoList.length + 1,
      text: newTask,
      completed: false
    }
    let todoItems = [newTaskItem, ...this.todoList];
    this.todoList = todoItems;
    // this.todoList.push(newTaskItem);
  }


  /**
   * Archives the todos
   */
  archiveTodos(): void {
    this.todoList = this.todoList.filter((todoItem: ToDoItem) => todoItem.completed === false);
  }
}
