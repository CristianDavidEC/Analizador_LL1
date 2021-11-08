export default class Analizador {

    constructor() {
        this.nombre = null;
        this.primeros = null;
        this.siguientes = null;
        this.conjuntoPre = [];

        this.inicial = null;
        this.gramatica = null;
        this.no_terminales = null;
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

    getConjuntoPre() {
        return this.conjuntoPre;
    }


    AnalizarGramatica(objeto) {
        let gramatica = objeto.gramatica;
        let noTer = objeto.no_terminales;
        let inicial = objeto.procucion_inicial;

        this.inicial = inicial;
        this.gramatica = gramatica;
        this.no_terminales = noTer;

        this.setPrimeros(this.obtenerPrimeros(gramatica, noTer));

        this.setSiguientes(this.obtenerSiguientes(gramatica, noTer));

        this.conjuntoPre = this.obtenerConjuntoPre(this.getPrimeros(), this.getSiguientes(), gramatica, noTer);

        return this.esLl1(this.conjuntoPre);
    }

    esLl1(conjuntoPreduccion) {
        for (let conjunto of conjuntoPreduccion) {
            //console.log(conjunto);
            var union = [];
            for (let c of conjunto.cp) {
                union = union.concat(c);
            }
            //Evalua si los valor del conjunto prdiccion son Unicos
            var unico = union.every( e => {
                var ele = union.filter(f => f == e);
                return ele.length == 1;
            });
            //Si el gramatica tiene en el cunjunto produccion elementos repetidos
            if (!unico){
                return false;
            }    
        }

        return true;
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
        var primeros = this.getPrimeros();
        var listSig = [];

        for (let ntEvaluado of listaNoTerminales) {
            var siguiente = {
                noTerminal: ntEvaluado,
                next: []
            };
            var producionesNt = this.buscanProducciones(ntEvaluado, gramatica, listaNoTerminales);
            var s = this.procesarSiguientes(siguiente, producionesNt, primeros, listaNoTerminales, listSig);
            listSig.push(s);
        }
        return listSig;
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

    procesarSiguientes(siguiente, produciones, listaPrim, listaNt, listSig) {
        //A --> aXB, a = termino anterior, X = termino a evaluar, B = termino siguiente
        var gramatica = this.gramatica;

        // Si x es la produccion inicial agregar $ a Sig(x)
        this.esInicial(siguiente);

        for (let prod of produciones) {
            var ntP = prod.noTerminal;
            var produccion = prod.produccion;

            var sig = produccion[produccion.indexOf(siguiente.noTerminal) + 1];

            //Si B es & entonces agregar Sig(X) a Sig(A)
            if (sig == undefined) {
                if (siguiente.noTerminal !== ntP) {
                    var nuwSig = this.procesarSigA(ntP, gramatica, listaNt, listaPrim);
                    siguiente.next = [...new Set(siguiente.next.concat(nuwSig.next))];
                }

            }//Si B es terminal entonces agregar B a Sig(X)
            else if (!listaNt.includes(sig)) {
                siguiente.next.push(sig);

            }// Si B es no terminal entonces agregar Sig(X) a Prim(B)
            else if (listaNt.includes(sig)) {
                var prim = listaPrim.filter(e => e[0] == sig).shift().slice(1);
                siguiente.next = [...new Set(siguiente.next.concat(prim))];

                //Si B es & entonces agregar Sig(X) a Sig(A)
                if (siguiente.next.includes('&')) {
                    siguiente.next = siguiente.next.filter(function (e) {
                        return e !== '&';
                    });

                    var nuwSig = this.procesarSigA(ntP, gramatica, listaNt, listaPrim, listSig);
                    siguiente.next = [...new Set(siguiente.next.concat(nuwSig.next))];
                }
            }
        }
        //listSig.push(siguiente);
        return siguiente;
    }

    esInicial(siguiente) {
        if (siguiente.noTerminal == this.inicial) {
            siguiente.next.push('$');
        }
    }

    procesarSigA(ntP, gramatica, listaNt, listaPrim, listSig) {
        var prodNt = this.buscanProducciones(ntP, gramatica, listaNt);
        var sigA = {
            noTerminal: ntP,
            next: []
        };
        return this.procesarSiguientes(sigA, prodNt, listaPrim, listaNt, listSig);
    }

    obtenerConjuntoPre(listaPrimeros, listaSiguintes, gramatica, noTer) {
        let listaCp = [];
        for (let nt of noTer) {
            var conjunto = {
                noTerminal: nt,
                cp: []
            };
            var producciones = gramatica[nt].map(e => e.split(' '));

            for (let prod of producciones) {
                var elementos = [];
                //Si la produccion es &, agregar las sig(a) a conjunto prediccion
                if (prod[0] == '&') {
                    var sig = listaSiguintes.filter(e => e.noTerminal == nt);
                    elementos = elementos.concat(sig[0].next); 

                } //Si el Elemento es No Terminal
                else if (noTer.includes(prod[0])) {
                    var prim = listaPrimeros.filter(e => e[0] == prod[0]).shift().slice(1);
                    if (prim.includes('&')) {
                        prim = prim.filter(function (e) {
                            return e !== '&';
                        });
                        //Si el prim(a) tiene & Agrega los sig(X) a conjunto prediccion
                        elementos = elementos.concat(prim);
                        var sig = listaSiguintes.filter(e => e.noTerminal == nt);
                        elementos = elementos.concat(sig[0].next);
                    }else {
                        //Agrega prim(a) a conjunto prediccion
                        elementos = elementos.concat(prim);
                    }

                } //Si el elemento es Terminal
                else if (!noTer.includes(prod[0])) {
                    elementos.push(prod[0]);
                }
                conjunto.cp.push(elementos);
            }
            listaCp.push(conjunto);
        }
        return listaCp;
    }
}


