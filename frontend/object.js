const id = localStorage.getItem("id");

document.getElementById("renderButton").addEventListener("click", renderData);

fetchData().then(data => {
    const temperatureDate = new Date(data[0].date_temperature);
    const formattedTemperatureDate = temperatureDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const humidityDate = new Date(data[0].date_humidity);
    const formattedHumidityDate = humidityDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const pressureDate = new Date(data[0].date_pressure);
    const formattedPressureDate = pressureDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    addInfo("Метеостанция", data[0].Name1);
    addInfo("Координаты", data[0].CoordX + ";" + data[0].CoordY);
    addInfo("Температура", data[0].Temperature + "°C" + "(" +formattedTemperatureDate  + ")");
    addInfo("Влажность", data[0].humidity + "%" + "(" + formattedHumidityDate  + ")");
    addInfo("Давление", data[0].pressure + "("+formattedPressureDate + ")");
    document.title = data[0].Name1;
});

function addInfo(key, value) {
    const p = document.createElement("p");
    p.classList.add("info-text");
    p.innerHTML = `<span>${key}:</span> ${value}`;
    document.getElementById("infoContainer").appendChild(p);
}

function renderData() {
    const format = document.querySelector('input[name="format"]:checked').value;
    const selectedData = Array.from(document.querySelectorAll('input[name="data"]:checked')).map(cb => cb.value);
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (format === "chart") {
        document.getElementById("chartContainer").style.display = "block";
        document.getElementById("tableContainer").style.display = "none";
        renderCharts(selectedData, startDate, endDate);
    } else {
        document.getElementById("chartContainer").style.display = "none";
        document.getElementById("tableContainer").style.display = "block";
        renderTable(selectedData, startDate, endDate);
    }
}

async function fetchDataForParam(param, startDate, endDate) {
    const response = await fetch(`http://127.0.0.1:5000/data/${param}/${id}?start=${startDate}&end=${endDate}`);
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    return await response.json();
}

async function fetchTemperatureData(startDate, endDate) {
    return await fetchDataForParam('temp', startDate, endDate);
}

async function fetchHumidityData(startDate, endDate) {
    return await fetchDataForParam('humidity', startDate, endDate);
}

async function fetchPressureData(startDate, endDate) {
    return await fetchDataForParam('pressure', startDate, endDate);
}

async function fetchData() {
    const response = await fetch(`http://127.0.0.1:5000/data/${id}`);
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    return await response.json();
}

function renderCharts(selectedData, startDate, endDate) {
    if (selectedData.includes("temperature")) {
        fetchTemperatureData(startDate, endDate).then(data => {
            const temperatureDates = data.map(entry => new Date(entry.Measurement_Date).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' }));
            const temperatures = data.map(entry => entry.Temperature);

            const ctx = document.getElementById('temperatureChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: temperatureDates,
                    datasets: [{
                        label: 'Температура',
                        data: temperatures,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
        document.getElementById("temperatureChartContainer").style.display = "block";
    } else {
        document.getElementById("temperatureChartContainer").style.display = "none";
    }

    if (selectedData.includes("humidity")) {
        fetchHumidityData(startDate, endDate).then(data => {
            const humidityDates = data.map(entry => new Date(entry.Measurement_Date).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' }));
            const humidities = data.map(entry => entry.Humidity);

            const ctx = document.getElementById('humidityChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: humidityDates,
                    datasets: [{
                        label: 'Влажность',
                        data: humidities,
                        backgroundColor: 'rgba(255, 192, 192, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
        document.getElementById("humidityChartContainer").style.display = "block";
    } else {
        document.getElementById("humidityChartContainer").style.display = "none";
    }

    if (selectedData.includes("pressure")) {
        fetchPressureData(startDate, endDate).then(data => {
            const pressureDates = data.map(entry => new Date(entry.Measurement_Date).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' }));
            const pressures = data.map(entry => entry.Pressure);

            const ctx = document.getElementById('pressureChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: pressureDates,
                    datasets: [{
                        label: 'Давление',
                        data: pressures,
                        backgroundColor: 'rgba(192, 192, 255, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
        document.getElementById("pressureChartContainer").style.display = "block";
    } else {
        document.getElementById("pressureChartContainer").style.display = "none";
    }
}

async function renderTable(selectedData, startDate, endDate) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    for (const dataType of selectedData) {
        let fetchFunction;
        switch (dataType) {
            case "temperature":
                fetchFunction = fetchTemperatureData;
                break;
            case "humidity":
                fetchFunction = fetchHumidityData;
                break;
            case "pressure":
                fetchFunction = fetchPressureData;
                break;
        }

        const data = await fetchFunction(startDate, endDate);
        data.forEach(entry => {
            const row = document.createElement("tr");
            const typeCell = document.createElement("td");
            const dateCell = document.createElement("td");
            const valueCell = document.createElement("td");

            typeCell.textContent = dataType.charAt(0).toUpperCase() + dataType.slice(1);
            dateCell.textContent = new Date(entry.Measurement_Date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });
            valueCell.textContent = entry[dataType.charAt(0).toUpperCase() + dataType.slice(1)];

            row.appendChild(typeCell);
            row.appendChild(dateCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        });
    }
}