'use strict';

document.addEventListener('DOMContentLoaded', event => {
    
    //lectura del Archivo
    let archivo = document.querySelector('#json');
    archivo.addEventListener('change', (e) => {
        let json = e.target.files[0];
        if (json) {
            let reader = new FileReader();
            reader.onload = function(eve) {
                let contenido = eve.target.result;
                console.log(contenido)
                document.querySelector('#contenido').innerText = contenido;
                let objeto = JSON.parse(contenido)
                console.log(objeto)
            }
            reader.readAsText(json)
        } else {
            console.log('error al cargar el archivo')
        }

    })

})