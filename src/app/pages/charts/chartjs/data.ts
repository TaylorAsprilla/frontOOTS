import { ChartjsOptions } from "./chartjs.model";

// chart data
const LINECHART: ChartjsOptions<'line'> =
{
    type: 'line',
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: "Current Week",
        backgroundColor: 'rgba(26, 188, 156, 0.3)',
        borderColor: '#1fa083',
        data: [32, 42, 42, 62, 52, 75, 62],
        tension: 0.4,
        fill: {
            target: 'origin',
            above: 'rgba(26, 188, 156, 0.3)',
        },
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: '#1fa083',
        pointHoverBorderColor: '#1fa083',
        pointBorderWidth: 1.5,
        capBezierPoints: true,
    }, {
        label: "Previous Week",
        fill: true,
        backgroundColor: 'transparent',
        borderColor: '#f1556c',
        borderDash: [5, 5],
        data: [42, 58, 66, 93, 82, 105, 92],
        tension: 0.4,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: '#f1556c',
        pointHoverBorderColor: '#f1556c',
        pointBorderWidth: 1.5,
        capBezierPoints: true,
    }],
    chartOptions: {
        maintainAspectRatio: false,
        hover: {
            intersect: true
        },
        plugins: {
            filler: {
                propagate: false
            },
            legend: {
                display: false
            },
            tooltip: {
                intersect: false
            },
        },
        scales: {
            xAxes: {
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            yAxes: {
                ticks: {
                    stepSize: 20
                },
                display: true,
                grid: {
                    color: 'rgba(0,0,0,0)',
                }
            }
        }
    },
};

const BARCHART: ChartjsOptions<'bar'> = {
    type: 'bar',
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Sales Analytics',
            data: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 81],
            barPercentage: 0.7,
            categoryPercentage: 0.5,
        },
        {
            label: 'Dollar Rate',
            backgroundColor: '#e3eaef',
            borderColor: '#e3eaef',
            hoverBackgroundColor: '#e3eaef',
            hoverBorderColor: '#e3eaef',
            data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59],
            barPercentage: 0.7,
            categoryPercentage: 0.5,
        }
    ],
    chartOptions: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            yAxes: {
                grid: {
                    display: false,
                    color: 'rgba(0,0,0,0.05)'
                },
                stacked: false,
                ticks: {
                    stepSize: 20
                }
            },
            xAxes: {

                stacked: false,
                grid: {
                    color: 'rgba(0,0,0,0.01)'
                }
            }
        }
    }
}

const PIECHART: ChartjsOptions<'pie'> = {
    type: 'pie',
    chartOptions: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    },
    chartLabels: [
        "Direct",
        "Affilliate",
        "Sponsored",
        "E-mail"
    ],
    datasets: [
        {
            data: [300, 135, 48, 154],
            backgroundColor: ['#6658dd', '#fa5c7c', '#4fc6e1', '#ebeff2'],
            hoverBackgroundColor: ['#6658dd', '#fa5c7c', '#4fc6e1', '#ebeff2'],
            hoverBorderColor: "transparent",
            borderColor: "transparent",
        }
    ]

}

const DONUTCHART: ChartjsOptions<'doughnut'> = {
    type: 'doughnut',
    chartLabels: [
        'Direct',
        'Affilliate',
        'Sponsored',
        'E-mail'
    ],
    datasets: [
        {
            data: [128, 78, 48],
            backgroundColor: [
                '#6c757d',
                '#1abc9c',
                '#ebeff2'
            ],
            hoverBackgroundColor: [
                '#6c757d',
                '#1abc9c',
                '#ebeff2'
            ],
            borderColor: 'transparent',
            hoverBorderColor: 'transparent',
            borderWidth: [3],
        }],
    chartOptions: {
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                display: false
            }
        }
    }

}

const POLARCHART: ChartjsOptions<'polarArea'> = {
    type: 'polarArea',
    chartOptions: {
        maintainAspectRatio: false
    },
    chartLabels: [
        "Direct",
        "Affilliate",
        "Sponsored",
        "E-mail"
    ],
    datasets: [
        {
            data: [251, 135, 48, 154],
            backgroundColor: ['#4a81d4', '#fa5c7c', '#4fc6e1', '#ebeff2'],
            hoverBackgroundColor: ['#4a81d4', '#fa5c7c', '#4fc6e1', '#ebeff2'],
            hoverBorderColor: "transparent",
            borderColor: "transparent",
        }
    ],
}

const RADARCHART: ChartjsOptions<'radar'> = {
    type: 'radar',
    chartLabels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
        {
            label: "Desktops",
            backgroundColor: "rgba(57,175,209,0.2)",
            borderColor: "#39afd1",
            pointBackgroundColor: "#39afd1",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#39afd1",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: "Tablets",
            backgroundColor: "rgba(161, 127, 224,0.2)",
            borderColor: "#a17fe0",
            pointBackgroundColor: "#a17fe0",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#a17fe0",
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ],
    chartOptions: {
        maintainAspectRatio: false
    }
}

export { LINECHART, BARCHART, PIECHART, DONUTCHART, POLARCHART, RADARCHART };