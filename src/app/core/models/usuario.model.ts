export class UsuarioModel {
  constructor(
    public readonly id: number,
    public primerNombre: string,
    public primerApellido: string,
    public celular: string,
    public email: string,
    public numeroDocumento: string,
    public direccion: string,
    public ciudad: string,
    public fechaNacimiento: Date,
    public segundoNombre?: string,
    public segundoApellido?: string,
    public password?: string,
    public foto?: string,
    public estado?: boolean,
    public afiliacionReligioda?: string,
    public avafuenteRefirido?: string
  ) {}
}
