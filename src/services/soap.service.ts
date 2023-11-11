import { ISoapService } from '../types/soap';
import { ISubscriptionSOAP, SUBSCRIPTION_STATUS } from '../types/subscription';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createXML = (methodName: string, args?: { [key: string]: any }) => {
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

  getAllSubscriptionBySubscriberID = async (args: {
    subscriber_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => {
    const payload = this.createXML('getSubscriptionBySubscriberID', args);

    const soapResponse = await this.api.post(this.url, payload);

    const parsedResponse: IResponseModel = {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
    };

    // Check if multiple return objects exist in the response
    let returnData = soapResponse.getSubscriptionBySubscriberIDResponse.return;

    // If returnData is null, set it to an empty array
    if (returnData == null || returnData == undefined) {
      returnData = [];
    }
    
    if (!Array.isArray(returnData)) {
      returnData = [returnData];
    }

    parsedResponse.data = returnData.map((item: ISubscriptionSOAP) => ({
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      creator_id: item.creatorID,
      status: item.status,
      subscriber_id: item.subscriberID,
      subscriber_name: item.subscriberName,
    }));

    return parsedResponse;
  };

  getAllSubscriptions = async () => {
    const payload = this.createXML('getAllSubscriptions');
    const soapResponse = await this.api.post(this.url, payload);

    const parsedResponse: IResponseModel = {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
    };

    // Check if multiple return objects exist in the response
    let returnData = soapResponse.getAllSubscriptionsResponse.return;

    // If returnData is null, set it to an empty array
    if (returnData == null || returnData == undefined) {
      returnData = [];
    }

    if (!Array.isArray(returnData)) {
      returnData = [returnData];
    }

    parsedResponse.data = returnData.map((item: ISubscriptionSOAP) => ({
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      creator_id: item.creatorID,
      status: item.status,
      subscriber_id: item.subscriberID,
      subscriber_name: item.subscriberName,
    }));

    return parsedResponse;
  };

  getStatus = async (args: {
    creator_id: number;
    subscriber_id: number;
  }) => {
    const payload = this.createXML('getStatus', args);

    console.log(payload);
    const soapResponse = await this.api.post(this.url, payload);
    console.log(soapResponse);

    const parsedResponse: IResponseModel = {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
    };

    // Check if multiple return objects exist in the response
    let returnData = soapResponse.getStatusResponse.return;

    console.log(returnData);

    // If returnData is null, set it to an empty array
    if (returnData == null || returnData == undefined) {
      returnData = [];
    }
    
    if (!Array.isArray(returnData)) {
      returnData = [returnData];
    }

    parsedResponse.data = returnData['data'];

    return parsedResponse;
  }
}

export default SoapService;
