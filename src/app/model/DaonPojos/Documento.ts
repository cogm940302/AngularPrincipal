export class DocumentoSend { 
    captured: string;
    url: string;
    metodo: string;
    clientCapture:ClientCapture;
}   
 
export class ClientCapture{
    processedImage:ProcessedImage;
}

export class ProcessedImage{
    sensitiveData:SensitiveData;
}

export class SensitiveData{
    imageFormat: string;
    value: String;
}