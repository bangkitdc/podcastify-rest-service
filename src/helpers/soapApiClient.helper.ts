import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { IResponseModel } from '../types/soap';
import { HttpError } from '.';
import { HttpStatusCode } from '../types/http';

class SoapApiClient {
  private axiosInstance;
  private SOAP_API_KEY = process.env.SOAP_API_KEY as string;
  private SOAP_BASE_URL = process.env.SOAP_BASE_URL as string;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.SOAP_BASE_URL,
      headers: {
        'Content-Type': 'text/xml',
        'x-api-key': this.SOAP_API_KEY,
      },
    });
  }

  post = async (endpoint: string, payload: string) => {
    try {
      const response = await this.axiosInstance.post(endpoint, payload);
      console.log(response.data);
      const parsedJsonResponse = await parseStringPromise(response.data);
      console.log(response.data);
      const responseModel: IResponseModel = {
        statusCode:
          parsedJsonResponse['S:Envelope']['S:Body'][0][
            'ns2:updateStatusResponse'
          ][0]['return'][0]['statusCode'][0],
        message:
          parsedJsonResponse['S:Envelope']['S:Body'][0][
            'ns2:updateStatusResponse'
          ][0]['return'][0]['message'][0],
      };

      if (responseModel.statusCode >= 400) {
        throw new HttpError(responseModel.statusCode, responseModel.message);
      }

      return responseModel;
    } catch (error) {
      console.error('Error in post method: ' + error);
      throw error;
    }
  };
}

export default SoapApiClient;
