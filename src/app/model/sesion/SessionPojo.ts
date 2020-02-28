export class sesionModel{
  _id: string; // este es el de mongo
  daonClientHref: string;
  daonHref: string;  // este me lo regresa daon
  terminos: boolean;
  correo: string;
  selfie: boolean;
  score: any = null;
}
