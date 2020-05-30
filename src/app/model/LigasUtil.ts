import { environment } from '../../environments/environment';
class LigasUtil {

  urlMiddleMongo(): string {
    console.log(environment);
    // return 'https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/usuario';
    return environment.baseUrl;
  }

  urlMiddleDaon(idTracking: string) {
    // return `https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/usuario/${idTracking}/daon`;
    return environment.baseUrl + `/${idTracking}/daon`;
  }

  urlMiddleRoot(idTracking: string) {
    // return `https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/usuario/${idTracking}/daon`;
    return environment.baseUrl + `/${idTracking}/`;
  }
}

export const LigaUtil = new LigasUtil();
