export class sesionModel {
  _id: string; // este es el de mongo
  daon: {
    daonClientHref: string;
    daonHref: string;  // este me lo regresa daon
    selfie: boolean;
    identity: boolean;
  };
  oferta: string;
  correo: string;
  terminos: boolean;
  score: any = null;
}
