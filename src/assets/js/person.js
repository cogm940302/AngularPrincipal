function validaRFC(patter, inputRFC){
    var rfc = inputRFC
    if (rfc.match(patter)){
            alert("La estructura de la clave de RFC es valida");
            return true;
        }else {
            alert("La estructura de la clave de RFC es incorrecta.");
            return false;
        }
}