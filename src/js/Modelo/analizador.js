export default class Analizador {

    constructor() {
        this.nombre = null;
        this.primeros = null;
        this.siguientes = null;
        this.conjuntoPre = null;
    }

    setPrimeros(primeros) {
        this.primeros = primeros;
    }

    getPrimeros() {
        return this.primeros;
    }

    setSiguientes(siguientes) {
        this.siguientes = siguientes;
    }

    getSiguientes() {
        return this.siguientes;
    }

    AnalizarGramatica(objeto) {
        let gramatica = objeto.gramatica;
        let noTer = objeto.no_terminales;
        let inicial = objeto.procucion_inicial;

        this.setPrimeros(this.obtenerPrimeros(gramatica, noTer));

        this.setSiguientes(this.obtenerSiguientes(gramatica, noTer, inicial));

    }

    obtenerPrimeros(gramatica, listaNoTerminales) {
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
        listaProducciones.forEach(produccion => {
            var simbolos = produccion.split(' ');

            //Verifica las condiciones para &
            if (simbolos[0] === '&') {
                // Si y1 hasta yn tiene & agregar & a Prim(x)
                if (simbolos.every(e => simbolos[0] == e)) {
                    primeros.push(simbolos[0]);
                } // Si y1 es & entonces agregar Prim(y2) a Prim(x)
                else {
                    var found = simbolos.find(e => e !== '&');
                    // y1 NO es terminal -> agregar Prim(y1) a Prim(x)
                    if (listaNoTerminales.includes(found)) {
                        return this.procesarPrimeros(gramatica, found, primeros, listaNoTerminales);
                    } // y1 es terminal -> agregar y1 a Prim(x)
                    else {
                        primeros.push(found);
                    }
                }
            }
            // y1 NO es terminal -> agregar Prim(y1) a Prim(x)
            else if (listaNoTerminales.includes(simbolos[0])) {
                return this.procesarPrimeros(gramatica, simbolos[0], primeros, listaNoTerminales);
            } // y1 es terminal -> agregar y1 a Prim(x)
            else {
                primeros.push(simbolos[0]);
            }
        });
        return primeros;
    }

    obtenerSiguientes(gramatica, listaNoTerminales, inicial) {
        var listaDeSiguientes = [];
        for (let noTerminalEvaluado of listaNoTerminales) {
            var siguientes = [noTerminalEvaluado];
            var produccionesNoTerminal = this.buscanProducciones(noTerminalEvaluado, gramatica, listaNoTerminales);
            var data = this.procesarSiguientes(noTerminalEvaluado, produccionesNoTerminal, siguientes, gramatica, listaNoTerminales, inicial);
            
            console.log(data);

        }
    }

    buscanProducciones(noTerminalBuscar, gramatica, listaNoTerminales) {
        var produccionesEncontradas = [];

        for (let llave of listaNoTerminales) {
            var producciones = gramatica[`${llave}`];
            for (let produccion of producciones) {
                var simbolos = produccion.split(' ');
                // Encuentra las producciones que contienen en no terminal a buscar
                if (simbolos.includes(noTerminalBuscar)) {
                    produccionesEncontradas.push({
                        noTerminal: llave,
                        produccion: simbolos
                    });
                }
            }
        }
        return produccionesEncontradas;
    }

    procesarSiguientes(noTerminalEvaluado, produccionesEncon, siguientes, gramatica, listaNoTerminales, inicial) {
        //A --> aXB, a = termino anterior, X = termino a evaluar, B = termino siguiente
        // Si x es la produccion inicial agregar $ a Sig(x)
        if (noTerminalEvaluado == inicial) {
            siguientes.push('$');
        }
    
        for (let objetoProduccion of produccionesEncon) {
            var noTerminalProd = objetoProduccion.noTerminal;
            var produccion = objetoProduccion.produccion;

            var posicionNt = produccion.indexOf(noTerminalEvaluado);
            var sig = produccion[posicionNt + 1];

            if (sig == undefined) {
                console.log('es undefined')
                if (noTerminalEvaluado !== noTerminalProd) {
                    var produccionesNoTerminal = this.buscanProducciones(noTerminalProd, gramatica, listaNoTerminales);
                    console.log(produccionesNoTerminal, noTerminalEvaluado);
                    return this.procesarSiguientes(noTerminalProd, produccionesNoTerminal, siguientes, gramatica, listaNoTerminales, inicial);
                }
            }
            else if (!listaNoTerminales.includes(sig)) {
                siguientes.push(sig);
            }
            else if (listaNoTerminales.includes(sig)) {
                var primeros = this.getPrimeros().filter(e => e[0] == sig).shift().slice(1);
                siguientes = siguientes.concat(primeros);
                siguientes = [...new Set(siguientes)];
            }
            
        }
        return siguientes;
    }


    /*procesarSiguientes (noTerminalEvaluado, produccion, noTerminalActual, inicial, listaNoTerminales, gramatica) {
        var siguiente = [];
        //A --> aXB, a = termino anterior, X = termino a evaluar, B = termino siguiente
        console.log(siguiente)
        // Si x es la produccion inicial agregar $ a Sig(x)
        if (noTerminalEvaluado == inicial) {
            siguiente.push('$');
        }
        
        var posicionNt = produccion.indexOf(noTerminalEvaluado);
        var sig = produccion[posicionNt + 1];
        
        //Si B es & entonces agregar Sig(X) a Sig(A)
        if (sig == undefined) {
            console.log(noTerminalEvaluado, sig);
            if(noTerminalEvaluado !== noTerminalActual) {
                siguiente = this.getSiguientes(noTerminalActual);
                this.buscarNoterminal(listaNoTerminales, gramatica, noTerminalActual, inicial, siguiente);
            }            
            
        }// Si B es no terminal entonces agregar Sig(X) a Prim(B)
        else if (listaNoTerminales.includes(sig)) {
            var primeros = this.getPrimeros().filter( e => e[0] == sig ).shift();
            siguiente = siguiente.concat(primeros.slice(1));
            //console.log(siguiente);
        }
        else {
            //console.log(sig, produccion, noTerminalEvaluado);
            siguiente.push(sig);
        }
        console.log(siguiente);   
    }*/


}


