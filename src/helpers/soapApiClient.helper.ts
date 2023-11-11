import axios from 'axios';
import { parseStringPromise, processors } from 'xml2js';

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

      const options = {
        explicitArray: false,
        tagNameProcessors: [processors.stripPrefix],
      };

      console.log(response.data);

      const parsedJsonResponse = await parseStringPromise(
        response.data,
        options,
      );

      console.log(parsedJsonResponse);

      // Get the soap body and remove optional attribute(s) from <Body> element
      const soapBody = parsedJsonResponse.Envelope.Body;

      if (soapBody.$) {
        delete soapBody.$;
      }

      return soapBody;
    } catch (error) {
      console.error('Error in post method: ' + error);
      throw error;
    }
  };
}

export default SoapApiClient;
