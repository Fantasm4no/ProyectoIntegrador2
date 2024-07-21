export class Libro {
    libroId?: number;
    titulo: string;
    edicion: number;
    genero: string;
    autor: string;
    contenido: string;
    portada: string;
    disponibilidad: boolean;
  
    constructor(libroId: number, titulo: string, edicion: number, genero: string, autor: string, contenido: string, portada: string, disponibilidad: boolean) {
      this.libroId = libroId;
      this.titulo = titulo;
      this.edicion = edicion;
      this.genero = genero;
      this.autor = autor;
      this.contenido = contenido;
      this.portada = portada;
      this.disponibilidad = disponibilidad;
    }
  }
  