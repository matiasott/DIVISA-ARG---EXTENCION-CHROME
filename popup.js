function obtenerDolar(api, tipo) {
    var url = api + tipo;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById(tipo.split('/').pop() + "-compra").innerHTML = '<p class = "valor">' + data.compra + '</p>';
            document.getElementById(tipo.split('/').pop() + "-venta").innerHTML = '<p class = "valor">' + data.venta + '</p>';
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
