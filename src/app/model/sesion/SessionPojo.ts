export class sesionModel {
  _id: string; // este es el de mongo
  servicios: Servicios;
  correo: string;
  terminos: boolean;
  score: any = null;

}

export class Servicios {
    nombre: string;
    datos: DatosServicios;
}

export class Daon implements DatosServicios {
  daonClientHref: string;
  daonHref: string;  // este me lo regresa daon
  selfie: boolean;
}

export interface DatosServicios {}
