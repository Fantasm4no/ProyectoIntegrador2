import { Prestamo } from "./prestamo";

export class Usuario {
    usuarioId?: number;
    username: string;
    password: string;
    email: string;
    role: string;

    constructor(usuarioId: number, username: string, password: string, email: string, role: string){
        this.usuarioId = usuarioId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }
}