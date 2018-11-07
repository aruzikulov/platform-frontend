import { inject, injectable } from "inversify";

import { Dictionary } from "lodash";
import { symbols } from "../../../di/symbols";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
} from "./EtoFileApi.interfaces";

const BASE_PATH = "/api/eto-listing/etos";
const ETO_DOCUMENTS_PATH = "/me/documents";
const ETO_DOCUMENTS_INFO_PATH = "/me/documents/state_info";
const ETO_TEMPLATES_PATH = "/me/templates";

export class EtoFileApiError extends Error {}
export class FileAlreadyExists extends EtoFileApiError {}

@injectable()
export class EtoFileApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {}

  public async getAllEtoDocuments(): Promise<TEtoDocumentTemplates> {
    const response = await this.httpClient.get<TEtoDocumentTemplates>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
    });

    return response.body;
  }

  public async uploadEtoDocument(
    file: File,
    documentType: EEtoDocumentType,
  ): Promise<IEtoDocument> {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "document_data",
      JSON.stringify({
        mime_type: "application/pdf",
        document_type: documentType,
        name: file.name,
        form: "document",
      }),
    );
    const response = await this.httpClient.post<IEtoDocument>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
      formData: data,
      allowedStatusCodes: [409],
    });
    if (response.statusCode === 409) {
      throw new FileAlreadyExists();
    }
    return response.body;
  }

  public async deleteSpecificEtoDocument(ipfsHash: string): Promise<IHttpResponse<string>> {
    const response = await this.httpClient.delete<IHttpResponse<string>>({
      baseUrl: BASE_PATH,
      url: `${ETO_DOCUMENTS_PATH}/${ipfsHash}`,
    });

    return response.body;
  }

  public async getEtoFileStateInfo(): Promise<IHttpResponse<IEtoFiles>> {
    const response = await this.httpClient.get<IHttpResponse<IEtoFiles>>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_INFO_PATH,
    });
    return response.body;
  }

  public async getAllEtoTemplates(): Promise<IHttpResponse<TEtoDocumentTemplates>> {
    const response = await this.httpClient.get<IHttpResponse<TEtoDocumentTemplates>>({
      baseUrl: BASE_PATH,
      url: ETO_TEMPLATES_PATH,
    });
    return response.body;
  }

  public async getEtoTemplate(
    etoDocument: IEtoDocument,
    inputs: Dictionary<string>,
  ): Promise<IHttpResponse<IEtoDocument>> {
    const response = await this.httpClient.get<IHttpResponse<IEtoDocument>>({
      baseUrl: BASE_PATH,
      url: `${ETO_TEMPLATES_PATH}/${etoDocument.documentType}`,
      queryParams: {
        inputs: JSON.stringify(inputs),
      },
      skipResponseParsing: true,
    });
    return response.body;
  }

  public async getSpecificEtoTemplate(
    etoId: string,
    etoDocument: IEtoDocument,
    inputs: Dictionary<string>,
  ): Promise<IHttpResponse<IEtoDocument>> {
    const response = await this.httpClient.get<IHttpResponse<IEtoDocument>>({
      baseUrl: BASE_PATH,
      url: `${etoId}/${ETO_TEMPLATES_PATH}/${etoDocument.documentType}`,
      queryParams: {
        inputs: JSON.stringify(inputs),
      },
      skipResponseParsing: true,
    });

    return response.body;
  }
}
