import { Libro } from "./libro";
import { Usuario } from "./usuario";

export class Reserva {
    reservaId?: number;
    libro: Libro;
    usuario: Usuario;
    fechaReserva: string;
    reservado: boolean;
  
    constructor(reservaId: number, libro: Libro, usuario: Usuario, fechaReserva: string, reservado: boolean) {
      this.reservaId = reservaId;
      this.libro = libro;
      this.usuario = usuario;
      this.fechaReserva = fechaReserva;
      this.reservado = reservado;
    }
  }