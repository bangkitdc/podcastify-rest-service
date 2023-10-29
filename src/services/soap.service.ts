import { ISoapService } from '../types/soap';
import { SUBSCRIPTION_STATUS } from '../types/subscription';
import { SoapApiClient } from '../helpers';

class SoapService implements ISoapService {
  private serviceEndpoint = 'http://service.podcastify.com/';
  private api;

  constructor(private url: string) {
    this.api = new SoapApiClient();
  }

  private createXML = (methodName: string, args: { [key: string]: any }) => {
    let xmlArgs = '';
    for (const key in args) {
      xmlArgs += `<${key}>${args[key]}</${key}>`;
    }

    return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="${this.serviceEndpoint}">
      <soapenv:Header/>
      <soapenv:Body>
         <ser:${methodName}>
            ${xmlArgs}
         </ser:${methodName}>
      </soapenv:Body>
    </soapenv:Envelope>`;
  };

  updateStatus = async (args: {
    creator_id: number;
    subscriber_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => {
    const payload = this.createXML('updateStatus', args);
    const response = await this.api.post(this.url, payload);

    return response;
  };
}

export default SoapService;
