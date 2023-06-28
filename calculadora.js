function calcularEquivalencia(tipo, cantidad, opcion) {
    var diccionarioValores = obtenerDiccionarioDeStore();
    var tipoCambio = diccionarioValores[tipo];

    var valor;

    if (opcion === 'venta') {
        valor = tipoCambio.venta;
    } else if (opcion === 'promedio') {
        valor = tipoCambio.promedio;
    } else {
        valor = tipoCambio.compra;
    }

    var resultado = cantidad / valor;
    return resultado.toFixed(2); // Redondear el resultado a 2 decimales
}

function calcular() {
    var tipo = document.getElementById('tipo').value;
    var cantidad = parseFloat(document.getElementById('cantidad').value);
    var opcion = document.getElementById('opcion').value;

    if (isNaN(cantidad) || cantidad === 0) {
        alert('Por favor, ingresa un valor numérico válido.');
        return; // Detener la ejecución de la función
    }

    var equivalencia = calcularEquivalencia(tipo, cantidad, opcion);
    var simbolofinal = simbolo(tipo)
    document.getElementById('resultado').innerHTML = 'Equivalente a <strong> ' + equivalencia + " " + simbolofinal + " </strong>a precio de " + opcion + " en " + tipo;

}

document.getElementById("botonCalcular").addEventListener("click", function () {
    calcular();
});


function obtenerDiccionarioDeStore() {
    var diccionarioString = localStorage.getItem('diccionarioValores');
    var diccionario = JSON.parse(diccionarioString);
    return diccionario;
}

function simbolo(valor) {
    var simbolo = ""
    if (valor) {
        switch (valor) {
            case 'Dólar Blue':
                simbolo = 'US$';
                break
            case 'Dólar Oficial':
                simbolo = 'US$';
                break
            case 'Dólar MEP':
                simbolo = 'US$';
                break
            case 'Euro Oficial':
                simbolo = '€';
                break
            case 'Euro Blue':
                simbolo = '€';
                break
            case 'Peso Argentino':
                simbolo = 'AR$';
        }
    }

    return simbolo

}


function mostrarAR() {
    document.getElementById("casillaAR").style.display = "block";
    document.getElementById("casillaUS").style.display = "none";
}

function mostrarUS() {
    document.getElementById("casillaUS").style.display = "block";
    document.getElementById("casillaAR").style.display = "none";
}

document.getElementById("buttonAR").addEventListener("click", function () {
    mostrarAR();
});

document.getElementById("buttonUS").addEventListener("click", function () {
    mostrarUS();
});

document.getElementById("botonCalcular2").addEventListener("click", function () {
    calcular2();
});


function calcular2(){


    var tipoCambiar = document.getElementById('tipo2').value;
    var cantidadValor = parseFloat(document.getElementById('cantidad2').value);
    var opcionPrecio = document.getElementById('opcion2').value;

    if (isNaN(cantidadValor) || cantidadValor === 0) {
        alert('Por favor, ingresa un valor numérico válido.');
        return; // Detener la ejecución de la función
    }

    var resultadoUS=calcularEquivalenciaPeso(tipoCambiar,cantidadValor, opcionPrecio)

    document.getElementById('resultado2').innerHTML = 'Equivalente a <strong> ' + resultadoUS + " AR$ </strong>usando el valor " + opcionPrecio + " del " + tipoCambiar



}

function calcularEquivalenciaPeso(tipo,cantidad,opcion) {

    console.log(tipo)
    console.log(cantidad)
    console.log(opcion)

    var diccionarioValores = obtenerDiccionarioDeStore();
    console.log(diccionarioValores)
    var valor = diccionarioValores[tipo][opcion]
    console.log(valor)
    var resultado = cantidad * valor;
    return resultado.toFixed(2); // Redondear el resultado a 2 decimales


}