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

    if (tipo == "Peso Argentino"){

        calcularEquivalenciaPeso(cantidad, opcion)

        
    }else{

        var equivalencia = calcularEquivalencia(tipo, cantidad, opcion);
        var simbolofinal = simbolo(tipo)
        document.getElementById('resultado').innerHTML = 'Equivalente a <strong> ' + equivalencia + " "+ simbolofinal + " </strong>a precio de " + opcion + " en " + tipo;

    }

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


function calcularEquivalenciaPeso(cantidad, opcion) {
    var diccionarioValores = obtenerDiccionarioDeStore();
    var arrayDatos=[]
    diccionarioValores[""].opcion



    


    


    var resultado = cantidad / valor;
    return resultado.toFixed(2); // Redondear el resultado a 2 decimales

    
}
