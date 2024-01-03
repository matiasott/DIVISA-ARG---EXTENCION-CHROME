document.addEventListener('DOMContentLoaded', function () {

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
                // Calcula el valor promedio para el día actual
                var todaySell = todayData.value_sell;
                var todayBuy = todayData.value_buy;
                var todayAverage = (todaySell + todayBuy) / 2;

                // Calcula el valor promedio para el día anterior
                var yesterdaySell = yesterdayData.value_sell;
                var yesterdayBuy = yesterdayData.value_buy;
                var yesterdayAverage = (yesterdaySell + yesterdayBuy) / 2;

                // Asigna los valores promedio a las variables correspondientes
                var dolarActual = todayAverage;
                var dolarAnterior = yesterdayAverage;

                // Función para verificar los valores y mostrar el mensaje correspondiente
                function verificarValores2() {

                    if (dolarActual - dolarAnterior > 3) {

                        var mensaje = document.createElement('div');
                        mensaje.textContent = "Está subiendo el dólar blue.";
                        mensaje.classList.add("alert", "alert-success", "small-message");
                        var body = document.getElementsByTagName('body')[0];
                        body.appendChild(mensaje);

                        setTimeout(function () {
                            body.removeChild(mensaje);
                        }, 4000);


                    } else if (dolarAnterior - dolarActual > 3) {
                        var mensaje = document.createElement('div');
                        mensaje.textContent = "Está bajando el dólar blue.";
                        mensaje.classList.add("alert", "alert-danger", "small-message");
                        var body = document.getElementsByTagName('body')[0];
                        body.appendChild(mensaje);

                        setTimeout(function () {
                            body.removeChild(mensaje);
                        }, 4000);


                    }
                }

                // Llama a la función inicialmente
                verificarValores2();


            } else {
                console.log('No se encontraron datos para el día actual y el día anterior.');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});
