import { ISoapService } from '../types/soap';
import { SUBSCRIPTION_STATUS } from '../types/subscription';
import { SoapApiClient } from '../helpers';
import { IResponseModel } from '../types/soap';
import { HttpError } from '../helpers';
import { HttpStatusCode } from '../types/http';

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
    const soapResponse = await this.api.post(this.url, payload);

    const parsedResponse: IResponseModel = {
      statusCode: soapResponse.updateStatusResponse.return.statusCode,
      message: soapResponse.updateStatusResponse.return.message,
    };

    if (parsedResponse.statusCode >= 400) {
      throw new HttpError(parsedResponse.statusCode, parsedResponse.message);
    }

    return parsedResponse;
  };

  getAllSubscriptionByCreatorId = async (args: {
    creator_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => {
    const payload = this.createXML('getSubscriptionByCreatorID', args);
    const soapResponse = await this.api.post(this.url, payload);

    const parsedResponse: IResponseModel = {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
    };

    // Check if multiple return objects exist in the response
    let returnData = soapResponse.getSubscriptionByCreatorIDResponse.return;
    if (!Array.isArray(returnData)) {
      returnData = [returnData];
    }

    parsedResponse.data = returnData.map((item: any) => ({
      createdAt: item.createdAt.nanos,
      creatorID: item.creatorID,
      status: item.status,
      subscriberID: item.subscriberID,
      subscriberName: item.subscriberName,
      updatedAt: item.updatedAt.nanos,
    }));

    return parsedResponse;
  };
}

export default SoapService;
