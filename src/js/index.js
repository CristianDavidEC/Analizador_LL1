'use strict';

import Controlador from './Controlador/controlador.js'

document.addEventListener('DOMContentLoaded', event => {

    var controlador = new Controlador();
    var contenido = null;
    var resultado = document.querySelector('#resultado');

    resultado.innerHTML = `
    <p>
        Aqui se mostraran los resultados del analisis de la gramatica.
    </p>`;

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
            document.querySelector('#contenido').innerText = 'Error al cargar el archivo';
        }
    });

    let botonAnalizar = document.querySelector('#analizar-gramatica');
    botonAnalizar.addEventListener("click", (e) => {
        let respuesta = document.querySelector('#respuesta');

        respuesta.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>`;

        if (contenido !== null) {
            controlador.obtenerObjeto(contenido);

            if (controlador.esLl1()) {
                setTimeout(() => {
                    respuesta.innerHTML = `<h4><i class="bi bi-check-circle"></i> La gramatica es LL1</h4>`
                }, 1500);
            } else {
                console.log(controlador.esLl1());
                setTimeout(() => {
                    respuesta.innerHTML = `<h4><i class="bi bi-x-square"></i> La gramatica no es LL1</h4>`
                }, 1500);
            }
        }
        else {
            document.querySelector('#contenido').innerText = 'No se ha cargado el archivo';
            setTimeout(() => {
                respuesta.innerHTML = `<h4><i class="bi bi-exclamation-diamond"> No se ha cargado el archivo</h4>`
            }, 1000);
        }
    });

    let botonPrimeros = document.querySelector('#primeros');
    botonPrimeros.addEventListener("click", (e) => {
        var primeros = controlador.primeros();
        var respuesta = mostrarPrimeros(primeros);

        resultado.innerHTML = `
        <h4>Primeros:</h4>
        <p>${respuesta}</p>`;
    });

    let botonSiguientes = document.querySelector('#siguientes');
    botonSiguientes.addEventListener("click", (e) => {
        var siguientes = controlador.siguientes();
        var respuesta = mostrarSiguientes(siguientes);

        resultado.innerHTML = `
        <h4>Siguientes:</h4>
        <p>${respuesta}</p>`;
    });

    let conjunto = document.querySelector('#conjunto');
    conjunto.addEventListener("click", (e) => {
        var conjuntoP =controlador.conjuntoPreduccion();
        var respuesta = mostrarConjunto(conjuntoP);

        resultado.innerHTML = `
        <h4>Conjunto Prediccion:</h4>
        <p>${respuesta}</p>`;
    });

    let todo = document.querySelector('#todo');
    todo.addEventListener("click", (e) => {
        var primeros = controlador.primeros();
        var siguientes = controlador.siguientes();
        var conjuntoP =controlador.conjuntoPreduccion();
        
        var respuesta1 = mostrarPrimeros(primeros);
        var respuesta2 = mostrarSiguientes(siguientes);
        var respuesta3 = mostrarConjunto(conjuntoP);

        resultado.innerHTML = `
        <h4>Primeros:</h4> 
        <p>${respuesta1}</p>
        <h4>Siguientes:</h4> 
        <p>${respuesta2}</p>
        <h4>Conjunto de Prediccion:</h4> 
        <p>${respuesta3}</p>`;
        ;
    });


    function mostrarPrimeros(primeros) {
        var respuesta = '';
        for (let prim of primeros) {
            let texto = '';
            texto = `Prim(${prim[0]}) = { `
            prim.shift();
            var t = prim.toString();
            texto += t + ' }';
            respuesta += texto + '<br>';
        }
        return respuesta;
    }

    function mostrarSiguientes(siguientes) {
        let respuesta = '';
        for (let sig of siguientes) {
            let texto = '';
            texto = `Sig(${sig.noTerminal}) = { ${sig.next.toString()} }`
            respuesta += texto + '<br>';
        }
        return respuesta;
    }

    function mostrarConjunto(conjunto) {
        console.log(conjunto);
        let respuesta = '';
        for (let con of conjunto) {
            let texto = '';
            texto = `CP(${con.noTerminal}) = { `
            for(let c of con.cp){
                texto += `[ ${c.toString()} ] `;
            }
            texto += ' }'
            respuesta += texto + '<br>';
            console.log(texto);
        }
        return respuesta;
    }

});

