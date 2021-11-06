'use strict';

import Controlador from './Controlador/controlador.js'

document.addEventListener('DOMContentLoaded', event => {

    var controlador = new Controlador();
    var contenido = null;

    //lectura del Archivo
    let archivo = document.querySelector('#json');
    archivo.addEventListener('change', (e) => {
        let json = e.target.files[0];
        if (json) {
            let reader = new FileReader();
            reader.onload = function (eve) {
                contenido = eve.target.result;
                document.querySelector('#contenido').innerText = contenido;
            }
            reader.readAsText(json);

        } else {
            console.log('error al cargar el archivo')
        }
    });

    //TODO: crear animacion de carga o procesando
    let botonAnalizar = document.querySelector('#analizar-gramatica');
    botonAnalizar.addEventListener("click", (e) => {
        if (contenido !== null) {
            controlador.obtenerObjeto(contenido);
            console.log('Analizando ...')
        } else {
            console.log('no se ha cargado el archivo');
        }
    });

    let botonPrimeros = document.querySelector('#primeros');
    botonPrimeros.addEventListener("click", (e) => {
        controlador.primeros();
    });

    let botonSiguientes = document.querySelector('#siguientes');
    botonSiguientes.addEventListener("click", (e) => {
        controlador.siguientes();
    });

})