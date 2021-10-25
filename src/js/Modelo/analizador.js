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
        let listaProducciones = gramatica[`${noTerminal}`];
        listaProducciones.forEach( produccion => {
            let simbolos = produccion.split(' ');
            
            // y1 es terminal -> agregar y1 a Prim(x)
            // y1 NO es terminal -> agregar Prim(y1) a Prim(x)
            if( listaNoTerminales.includes(simbolos[0]) ) {
                return this.procesarPrimeros(gramatica, simbolos[0], primeros, listaNoTerminales);
            } else {
                primeros.push(simbolos[0]);
            }
        });
        return primeros;
    }

}