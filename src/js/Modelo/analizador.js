export default class Analizador {

    constructor () {
        this.nombre = null;
        this.primeros = null;
        this.siguientes = null;
        this.conjuntoPre = null;
    }

    setPrimeros (primeros) {
        this.primeros = primeros;
    }

    getPrimeros () {
        return this.primeros;
    }

    AnalizarGramatica (objeto) {
        let gramatica = objeto.gramatica;
        let noTer = objeto.no_terminales; 

        this.setPrimeros(this.obtenerPrimeros(gramatica, noTer)); 
    }

    obtenerPrimeros (gramatica, listaNoTerminales) {
        let listaDePrimeros = [];
        for (let noTerminal of listaNoTerminales) {  
            let primeros = [noTerminal];
            let dato = this.procesarPrimeros(gramatica, noTerminal, primeros, listaNoTerminales);
            listaDePrimeros.push(dato);
        }
        return listaDePrimeros;
    }

    procesarPrimeros(gramatica, noTerminal, primeros, listaNoTerminales) {

        var listaProducciones = gramatica[`${noTerminal}`];
        listaProducciones.forEach( produccion => {
        var simbolos = produccion.split(' ');

            //Verifica las condiciones para &
            if (simbolos[0] === '&') {
                // Si y1 hasta yn tiene & agregar & a Prim(x)
                if (simbolos.every( e => simbolos[0] == e )) {
                    primeros.push( simbolos[0] );
                } // Si y1 es & entonces agregar Prim(y2) a Prim(x)
                else {
                    var found = simbolos.find( e => e !== '&' );
                    // y1 NO es terminal -> agregar Prim(y1) a Prim(x)
                    if( listaNoTerminales.includes( found ) ) {
                        return this.procesarPrimeros(gramatica, found, primeros, listaNoTerminales);
                    } // y1 es terminal -> agregar y1 a Prim(x)
                    else {
                        primeros.push( found );
                    }
                }
            }
            // y1 NO es terminal -> agregar Prim(y1) a Prim(x)
            else if( listaNoTerminales.includes(simbolos[0]) ) {
                return this.procesarPrimeros(gramatica, simbolos[0], primeros, listaNoTerminales);
            } // y1 es terminal -> agregar y1 a Prim(x)
            else {
                primeros.push( simbolos[0] );
            }
        });
        return primeros;
    }    

}