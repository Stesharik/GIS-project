let center = [56.463769, 84.951853];
let hintTimeout;

function init() {
    let map = new ymaps.Map('map-test', {
        center: center,
        zoom: 18
    });
    fetchData().then(data => {
        data.forEach(mark => {
            addPlacemark(map, mark)
        })
    })
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('zoomControl');
    map.controls.remove('rulerControl');
    map.controls.remove('geolocationControl');

    // Добавляем обработчик события mouseleave на карту.
    map.events.add('mouseleave', function (e) {
        hintTimeout = setTimeout(() => {
            map.balloon.close();
        }, 200);
    });

    // Добавляем обработчик события mouseenter на карту.
    map.events.add('mouseenter', function (e) {
        clearTimeout(hintTimeout);
    });
}

ymaps.ready(init);

function addPlacemark(map, mark) {
    const coords = [mark.CoordX, mark.CoordY]
    const name = mark.Station
    const Temperature = mark.Temperature
    const Humidity = mark.Humidity
    const Pressure = mark.Pressure

    MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #1a2be2; font-weight: bold; font-family: Arial, sans-serif; font-size: 18px; text-shadow: 2px 2px 4px rgba(255,0,0,0.3);">$[properties.iconContent]</div>'
    )

    let placemark = new ymaps.Placemark(coords, {
        hintContent: " ",
        iconContent: `${name}\n ${Temperature} ℃`
    }, {
        iconLayout: 'default#imageWithContent',
        iconContentOffset: [10, 50],
        iconImageHref: 'icon.png',
        iconImageSize: [50, 50],
        iconImageOffset: [-19, -44],
        iconContentLayout: MyIconContentLayout
    });

    placemark.events.add('click', function (e) {
        window.open(`http://127.0.0.1:5500/object.html`, "_blank")
        localStorage.setItem("id", mark.id_points);
    });

    placemark.events.add('hintopen', () => {
        clearTimeout(hintTimeout);
        setTimeout(() => {
            map.balloon.open(coords, {
                contentHeader: name,
                contentBody: `
                    <div class="balloon">
                        <div class="balloon__weather">Погода: ${Temperature} ℃</div>
                        <div class="balloon__weather">Влажность: ${Humidity} % </div>
                        <div class="balloon__weather">Давление: ${Pressure} Па </div>
                    </div>
                `,
                contentFooter: ''
            });
        }, 500)
    });

    placemark.events.add('mouseleave', function (e) {
        hintTimeout = setTimeout(() => {
            map.balloon.close();
        }, 200);
    });

    placemark.events.add('mouseenter', function (e) {
        clearTimeout(hintTimeout);
    });

    map.geoObjects.add(placemark);
}

async function fetchData(){
    const response = await fetch('http://127.0.0.1:5000/data')
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`)
    }
    
    const data = await response.json();
    
    return data;
}
