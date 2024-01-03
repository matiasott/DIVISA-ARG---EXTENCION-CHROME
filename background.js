// background.js

// Función para mostrar una notificación
function showNotification(title, message, iconUrl) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: iconUrl,
        title: title,
        message: message
    });
}

// Realiza una solicitud HTTP GET para obtener el JSON
fetch('https://api.bluelytics.com.ar/v2/evolution.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Filtra los datos para obtener solo los del "source": "Blue"
        var blueData = data.filter(function (item) {
            return item.source === 'Blue';
        });

        // Obtiene los valores para el día actual y el día anterior
        var now = new Date();
        var options = { timeZone: 'America/Argentina/Buenos_Aires' };
        var today = now.toLocaleDateString('es-AR', options);

        // Extraer los componentes de la fecha
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var day = now.getDate().toString().padStart(2, '0');

        // Concatenar los componentes en el formato YYYY-MM-DD
        today = year + '-' + month + '-' + day;

        var todayData = blueData.find(function (item) {
            return item.date === today;
        });

        // Obtener la fecha de ayer
        var yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1); // Restar 1 día

        // Extraer los componentes de la fecha de ayer
        var yesterdayYear = yesterday.getFullYear();
        var yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, '0');
        var yesterdayDay = yesterday.getDate().toString().padStart(2, '0');

        // Concatenar los componentes en el formato YYYY-MM-DD para yesterday
        var yesterdayFormatted = yesterdayYear + '-' + yesterdayMonth + '-' + yesterdayDay;

        var yesterdayData = blueData.find(function (item) {
            return item.date === yesterdayFormatted;
        });


        // Verifica si se encontraron datos para el día actual y el día anterior
        if (todayData && yesterdayData) {
            var todaySell = todayData.value_sell;
            var todayBuy = todayData.value_buy;
            var todayAverage = (todaySell + todayBuy) / 2;

            var yesterdaySell = yesterdayData.value_sell;
            var yesterdayBuy = yesterdayData.value_buy;
            var yesterdayAverage = (yesterdaySell + yesterdayBuy) / 2;

            var dolarActualB = todayAverage;
            var dolarAnteriorB = yesterdayAverage;

            

            // Función para verificar los valores y mostrar el mensaje correspondiente
            function verificarValores() {                
                if (dolarActualB - dolarAnteriorB > 3) {
                    showNotification('ATENCION!!! DOLAR SUBE', 'Está subiendo el dólar blue.', './img/flecha_up.png');
                } else if (dolarAnteriorB - dolarActualB > 3) {
                    showNotification('ATENCION!!! DOLAR BAJA', 'Está bajando el dólar blue.', './img/flecha_down.png');
                    // Envía un mensaje a background.js para actualizar la insignia con el número 5
                    

                }
            }

            // Llama a la función inicialmente
            verificarValores();

            // Simula un cambio de valores para demostrar el mensaje
            // setTimeout(function () {
            //     verificarValores();
            // }, 5000);
        }else {
            console.log('No se encontraron datos para el día actual y el día anterior.');
        }
    })
    .catch(function (error) {
        console.log(error);
    });




