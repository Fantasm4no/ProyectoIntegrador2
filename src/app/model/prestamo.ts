import { Libro } from "./libro"
import { Usuario } from "./usuario"

export class Prestamo {
    prestamoId: number
    fechaPrestamo: Date
    fechaDevolucion: Date
    libro: Libro
    usuario: Usuario

    constructor(prestamoId: number, fechaPrestamo: Date, fechaDevolucion: Date, libro: Libro, usuario: Usuario){
        this.prestamoId = prestamoId;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaDevolucion = fechaDevolucion;
        this.libro = libro;
        this.usuario = usuario;
    }

}