'use strict';

import Controlador from './Controlador/controlador.js'

document.addEventListener('DOMContentLoaded', event => {

    let controlador = new Controlador();
    let contenido = null;

    //lectura del Archivo
    let archivo = document.querySelector('#json');
    archivo.addEventListener('change', (e) => {
        let json = e.target.files[0];
        if (json) {
            let reader = new FileReader();
            reader.onload = function(eve) {
                contenido = eve.target.result;
                document.querySelector('#contenido').innerText = contenido;
                
            }
            reader.readAsText(json);

        } else {
            console.log('error al cargar el archivo')
        }
    });

    let botonAnalizar = document.querySelector('#analizar-gramatica');
    botonAnalizar.addEventListener('click', () => {
        controlador.obtenerObjeto(contenido);
        console.log(controlador.getAnalizador().getPrimeros())  
    })

})