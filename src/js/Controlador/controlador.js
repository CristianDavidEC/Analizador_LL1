import Analizador from "../Modelo/analizador.js";

export default class Controlador {

    constructor () {
        this.objeto = null;
        this.analizador = new Analizador();
        this.esll1 = null;
    }

    setObjeto (objeto) {
        this.objeto = objeto;
    }

    getObjeto () {
        return this.objeto;
    }

    getAnalizador () {
        return this.analizador;
    }

    esLl1(){
        return this.esll1;
    }

    obtenerObjeto(datos){
        let objeto = JSON.parse( datos );
        this.setObjeto(objeto);
        this.esll1 = this.analizador.AnalizarGramatica( objeto );
    }

    primeros () {
        return this.analizador.getPrimeros();
    }

    siguientes () {
        return this.analizador.getSiguientes();
    }

    conjuntoPreduccion () {
        return this.analizador.getConjuntoPre();
    }

}