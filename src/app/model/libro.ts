export class Libro {
    libroId?: number;
    titulo: string;
    edicion: number;
    genero: string;
    autor: string;
    contenido: string;
    portada: string;
    ejemplares?: number;
  
    constructor(libroId: number, titulo: string, edicion: number, genero: string, autor: string, contenido: string, portada: string, ejemplares: number) {
      this.libroId = libroId;
      this.titulo = titulo;
      this.edicion = edicion;
      this.genero = genero;
      this.autor = autor;
      this.contenido = contenido;
      this.portada = portada;
      this.ejemplares = ejemplares
    }
  }
  