import Analizador from "../Modelo/analizador.js";

export default class Controlador {

    constructor () {
        this.objeto = null;
        this.analizador = new Analizador();
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

    obtenerObjeto(datos){
        let objeto = JSON.parse( datos );
        this.setObjeto(objeto);
        this.analizador.AnalizarGramatica( objeto );
    }

    primeros () {
        console.log(this.analizador.getPrimeros());
    }

    siguientes () {
        console.log(this.analizador.getSiguientes())
    }

}