function generateReport() {
    const periodo = document.getElementById('periodo').value;
    const csrf = document.getElementById('_csrf').value;

    fetch('/pagos/reporte_ingresos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            periodo
        })
    })
    .then(response => response.json())
    .then(ingresosData => {
        if (typeof ingresosData !== 'undefined') {
            var initialChartData = prepareChartData(ingresosData);
            renderChart(initialChartData);
        } else {
            console.log("javascript: ingresosData no está definido.");
        }
    });
}

function prepareChartData(ingresosData) {
    let labels = Object.keys(ingresosData.ingresosData);
    let data = Object.values(ingresosData.ingresosData);
    
    let series = [];

    data.forEach((month, index) => {
        let monthData = [];

        Object.keys(month).forEach(category => {
            monthData.push(month[category]);
        });

        let monthSeries = {
            name: labels[index],
            data: monthData
        };

        series.push(monthSeries);
    });

    return {
        labels: labels,
        series: series
    };
}

function getColorByCategoria(categoria) {
    switch (categoria) {
        case 'Colegiatura':
            return '#95404c';
        case 'Diplomado':
            return '#5a6581';
        case 'PagosExtras':
            return '#7c7f80';
        default:
            return '#000000';
    }
}

var myChart;

function renderChart(chartData) {
    var categories = ['Colegiatura', 'Diplomado', 'PagosExtras'];
    var labels = chartData.labels;
    var datasets = [];

    categories.forEach((category, index) => {
        var data = chartData.series.map(series => series.data[index]);
        var color = getColorByCategoria(category);

        datasets.push({
            label: category,
            backgroundColor: color,
            data: data
        });
    });

    var chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    var ctx = document.getElementById('bar-chart').getContext('2d');
    
    if (myChart) {
        myChart.data = chartConfig.data;
        myChart.options = chartConfig.options;
        myChart.update();
    } else {
        myChart = new Chart(ctx, chartConfig);
    }

    console.log("chartData: ", chartData);

    const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    chartData.series.forEach((serie, index) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = serie.name;
        const td2 = document.createElement('td');
        td2.textContent = serie.data.reduce((acc, value) => acc + value, 0).toFixed(2);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tabla.appendChild(tr);
    });

    document.getElementById('tabla').style.display = 'table';
    
    // probably also calculate and display the periodo total
}