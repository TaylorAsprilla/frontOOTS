export interface UsuarioInterface {
  primerNombre: string;
  primerApellido: string;
  celular: string;
  email: string;
  numeroDocumento: string;
  tipoDocumento: string;
  direccion: string;
  ciudad: string;
  segundoNombre: string;
  segundoApellido: string;
  password: string;
  foto: string;
  afiliacionReligiosa: string;
  fuenteReferido: string;

  [key: string]: string | number;
}

export interface UsuarioInfoInterface {
  readonly id?: number;
  primerNombre?: string;
  primerApellido?: string;
  celular?: string;
  email?: string;
  cargo?: string;
  numeroDocumento?: string;
  tipoDocumento?: string;
  direccion?: string;
  ciudad?: string;
  segundoNombre?: string;
  segundoApellido?: string;
  password?: string;
  foto?: string;
  afiliacionReligiosa?: string;
  fuenteReferido?: string;
}
