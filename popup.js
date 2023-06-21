function obtenerDolar(api, tipo) {
    var url = api + tipo;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        document.getElementById(tipo.split('/').pop() + "-compra").innerText = data.compra;
        console.log(data.compra)
        document.getElementById(tipo.split('/').pop() + "-venta").innerText = data.venta;
        console.log(data.venta)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Llamadas a la función obtenerDolar para obtener los valores
  obtenerDolar('https://dolar-api-argentina.vercel.app', '/v1/dolares/blue');
  obtenerDolar('https://dolar-api-argentina.vercel.app', '/v1/dolares/oficial');
  obtenerDolar('https://dolar-api-argentina.vercel.app', '/v1/dolares/bolsa');
  