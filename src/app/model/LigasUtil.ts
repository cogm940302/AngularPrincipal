class LigasUtil {

  urlMiddleMongo(): string {
    return 'https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/usuario';
  }

  urlMiddleDaon(idTracking: string) {
    return `https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/usuario/${idTracking}/daon`;
  }

}

export const LigaUtil = new LigasUtil();
