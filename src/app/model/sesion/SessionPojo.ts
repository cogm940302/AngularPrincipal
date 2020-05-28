export class sesionModel {
  _id: string; // este es el de mongo

  daon: {
    daonClientHref: string;
    daonHref: string;  // este me lo regresa daon
    selfie: boolean;
    identity: boolean;
    pruebaVida: boolean;
  };
  callback: string;
  estatus: string;
  oferta: string;
  correo: boolean;
  terminos: boolean;
  score: any = null;
  cuentaClabe: boolean;
  datosFiscales: boolean;
}
