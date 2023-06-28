// ------------------------------------------------------------------------
// Se esta haciendo uso de la Api que se encuentra publicada en esta pagina
// https://dolar-api-argentina.vercel.app
// ------------------------------------------------------------------------

function obtenerDolar(api, tipo) {
    var url = api + tipo;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById(tipo.split('/').pop() + "-compra").innerHTML = '<p class = "valor">$<span class="currency">AR</span> ' + data.compra.toFixed(2); + '</p>';
            document.getElementById(tipo.split('/').pop() + "-venta").innerHTML = '<p class = "valor">$<span class="currency">AR</span> ' + data.venta.toFixed(2); + '</p>';
            var promedio = (data.venta + data.compra) / 2
            promedio = promedio.toFixed(2);
            document.getElementById(tipo.split('/').pop() + "-promedio").innerHTML = '<p class = "valorP">$<span class="currency">AR</span> ' + promedio + '</p>';
            generarDiccionario(tipo, data.compra, data.venta, promedio)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const api = 'https://dolar-api-argentina.vercel.app'

// Llamadas a la función obtenerDolar para obtener los valores
obtenerDolar(api, '/v1/dolares/blue');
obtenerDolar(api, '/v1/dolares/oficial');
obtenerDolar(api, '/v1/dolares/bolsa');

// ------------------------------------------------------------------------
// Se esta haciendo uso de la Api que se encuentra publicada en esta pagina
// https://bluelytics.com.ar/#!/api
// ------------------------------------------------------------------------

function obtenerDatosAPI() {
    fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => {
            // Obtener los valores de la API
            const oficialEuro = data.oficial_euro;
            const blueEuro = data.blue_euro;

            // Actualizar los valores en el HTML
            document.getElementById('oficial_euro-compra').innerHTML = '<p class="valor">$<span class="currency">AR</span> ' + oficialEuro.value_buy.toFixed(2); + '</p>';
            document.getElementById('oficial_euro-venta').innerHTML = '<p class="valor">$<span class="currency">AR</span> ' + oficialEuro.value_sell.toFixed(2); + '</p>';
            document.getElementById('oficial_euro-promedio').innerHTML = '<p class="valorP">$<span class="currency">AR</span> ' + oficialEuro.value_avg.toFixed(2); + '</p>';

            generarDiccionario("Euro Oficial", oficialEuro.value_buy, oficialEuro.value_sell, oficialEuro.value_avg)

            document.getElementById('blue_euro-compra').innerHTML = '<p class="valor">$<span class="currency">AR</span> ' + blueEuro.value_buy.toFixed(2); + '</p>';
            document.getElementById('blue_euro-venta').innerHTML = '<p class="valor">$<span class="currency">AR</span> ' + blueEuro.value_sell.toFixed(2); + '</p>';
            document.getElementById('blue_euro-promedio').innerHTML = '<p class="valorP">$<span class="currency">AR</span> ' + blueEuro.value_avg.toFixed(2); + '</p>';

            generarDiccionario("Euro Blue", blueEuro.value_buy, blueEuro.value_sell, blueEuro.value_avg)
        })
        .catch(error => {
            console.log('Error al obtener los datos de la API:', error);
        });
}

// Llamar a la función para obtener los datos y actualizar el HTML
obtenerDatosAPI();



// ------------------------------------------------------------------------
// esta funcion arma la grafica de acuerdo al crecimiento del dolar y escoje el color
//-------------------------------------------------------------------------


function generarGraficoDolar(id, lista) {
    let valoresDolar = lista.reverse();
    const canvas = document.getElementById(id); // Obtener el elemento del canvas

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const margen = 20; // Margen alrededor del gráfico
        const ancho = canvas.width - 2 * margen;
        const altura = canvas.height - 2 * margen;

        const puntos = [];

        for (let i = 0; i < valoresDolar.length; i++) {
            const x = margen + (i / (valoresDolar.length - 1)) * ancho;
            const y = margen + altura - ((valoresDolar[i] - Math.min(...valoresDolar)) / (Math.max(...valoresDolar) - Math.min(...valoresDolar))) * altura;
            puntos.push({ x, y });
        }

        const ultimoValor = valoresDolar[valoresDolar.length - 1];
        const penultimoValor = valoresDolar[valoresDolar.length - 2];
        let color;
        if (ultimoValor > penultimoValor) {
            color = 'green'; // El dólar subió
        } else if (ultimoValor < penultimoValor) {
            color = 'red'; // El dólar bajó
        } else {
            color = 'blue'; // El dólar se mantuvo igual
        }

        // Dibujar la línea continua suavizada
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;

        ctx.moveTo(puntos[0].x, puntos[0].y);

        for (let i = 1; i < puntos.length - 2; i++) {
            const xc = (puntos[i].x + puntos[i + 1].x) / 2;
            const yc = (puntos[i].y + puntos[i + 1].y) / 2;
            ctx.quadraticCurveTo(puntos[i].x, puntos[i].y, xc, yc);
        }

        // Últimos dos puntos
        ctx.quadraticCurveTo(puntos[puntos.length - 2].x, puntos[puntos.length - 2].y, puntos[puntos.length - 1].x, puntos[puntos.length - 1].y);

        ctx.stroke();
    }
}


// ------------------------------------------------------------------------
// esta funcion obtiene los valores de promedios para hacer una grafica posterioermente
// ------------------------------------------------------------------------


async function obtenerPromedios(dias) {
    const url = 'https://api.bluelytics.com.ar/v2/evolution.json';

    try {
        const response = await fetch(url);
        const data = await response.json();

        const ultimosDatosOficial = data.filter(item => item.source === 'Oficial').slice(0, dias);
        const ultimosDatosBlue = data.filter(item => item.source === 'Blue').slice(0, dias);

        const promediosOficial = ultimosDatosOficial.map(item => (item.value_sell + item.value_buy) / 2);
        const promediosBlue = ultimosDatosBlue.map(item => (item.value_sell + item.value_buy) / 2);

        return {
            promediosOficial,
            promediosBlue
        };
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return null;
    }
}

// ------------------------------------------------------------------------
// esta funcion es la llamada cuando se apretan los botones de intervalos para ver las graficas

// ------------------------------------------------------------------------

let diasgraficos = 7; // Valor inicial

function cambiarDias(valor) {

    switch (valor) {
        case '1s':
            diasgraficos = 7;
            break;
        case '1m':
            diasgraficos = 30;
            break;
        case '3m':
            diasgraficos = 90;
            break;
        case '6m':
            diasgraficos = 183;
            break;
        case '1a':
            diasgraficos = 365;
            break;
    }
    obtenerPromedios(diasgraficos).then(result => {
        if (result) {
            generarGraficoDolar("oficial-grafico", result.promediosOficial)
            generarGraficoDolar("blu-grafico", result.promediosBlue)
        }
    });
}

// ------------------------------------------------------------------------
// aca se llama a la fucnion por primera vez
// ------------------------------------------------------------------------
obtenerPromedios(diasgraficos).then(result => {
    if (result) {
        generarGraficoDolar("oficial-grafico", result.promediosOficial)
        generarGraficoDolar("blu-grafico", result.promediosBlue)
    }
});

// ------------------------------------------------------------------------
// escucha los eventos de click de los botones para ver las graficas con dierentes intervalos
// ------------------------------------------------------------------------


document.getElementById("button1").addEventListener("click", function () {
    cambiarDias('1s');
});

document.getElementById("button2").addEventListener("click", function () {
    cambiarDias('1m');
});

document.getElementById("button3").addEventListener("click", function () {
    cambiarDias('3m');
});

document.getElementById("button4").addEventListener("click", function () {
    cambiarDias('6m');
});

document.getElementById("button5").addEventListener("click", function () {
    cambiarDias('1a');
});

var diccionarioValores = {};

function generarDiccionario(tipo, compra, venta, promedio) {

    switch (tipo) {
        case '/v1/dolares/blue':
            tipo = "Dólar Blue";
            break;
        case '/v1/dolares/oficial':
            tipo = "Dólar Oficial";
            break;
        case '/v1/dolares/bolsa':
            tipo = "Dólar MEP";
            break;
    }

    diccionarioValores[tipo] = { compra: compra, venta: venta, promedio: promedio };

    if (Object.keys(diccionarioValores).length == 5) {
        guardarDiccionarioEnStore(diccionarioValores)
    }

}

function guardarDiccionarioEnStore(diccionario) {
    localStorage.setItem('diccionarioValores', JSON.stringify(diccionario));
}


function mostrarTexto() {
    document.getElementById("calculadora-text").style.display = "block";
}

function ocultarTexto() {
    document.getElementById("calculadora-text").style.display = "none";
}

document.getElementById("textocalcu").addEventListener("mouseover", function () {
    mostrarTexto();
});

document.getElementById("textocalcu").addEventListener("mouseout", function () {
    ocultarTexto();
});
