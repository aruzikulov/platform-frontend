import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { withParams } from "../../../utils/withParams";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import { TGeneralEtoData, TPartialCompanyEtoData, TPartialEtoSpecData } from "./EtoApi.interfaces";

const BASE_PATH = "/api/eto-listing/";
const COMPANIES_ME_DATA_PATH = "/companies/me";
const COMPANIES_DATA_PATH = "/companies/";
const ETOS_PATH = "/etos";
const ETO_DATA_PATH = "/etos/me";
const ETO_SUBMISSION_PATH = "/etos/me/submission";
const ETO_BOOK_BUILDING_PATH = "/etos/me/bookbuilding";
const ETO_PREVIEW_PATH = "/eto/view/:previewCode";

@injectable()
export class EtoApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private authorizedHttpClient: IHttpClient,
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
  ) {}

  public async getEtos(): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.authorizedHttpClient.get<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH,
    });
  }

  public async getMyEto(): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.authorizedHttpClient.get<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETO_DATA_PATH,
    });
  }

  public async putMyEto(data: TPartialEtoSpecData): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.authorizedHttpClient.put<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETO_DATA_PATH,
      body: data,
    });
  }

  public async getEtoPreview(previewCode: string): Promise<IHttpResponse<TPartialCompanyEtoData>> {
    return await this.httpClient.get<TPartialCompanyEtoData>({
      baseUrl: BASE_PATH,
      url: withParams(ETO_PREVIEW_PATH, { previewCode }),
    });
  }

  public async getEto(etoId: string): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.httpClient.get<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH + "/" + etoId,
    });
  }

  public async getCompany(): Promise<IHttpResponse<TPartialCompanyEtoData>> {
    return await this.authorizedHttpClient.get<TPartialCompanyEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_ME_DATA_PATH,
    });
  }

  public async getCompanyById(companyId: string): Promise<IHttpResponse<TPartialCompanyEtoData>> {
    return await this.httpClient.get<TPartialCompanyEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_DATA_PATH + companyId,
    });
  }

  public async putCompany(
    data: TPartialCompanyEtoData,
  ): Promise<IHttpResponse<TPartialCompanyEtoData>> {
    return await this.authorizedHttpClient.put<TPartialCompanyEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_ME_DATA_PATH,
      body: data,
    });
  }

  public async submitCompanyAndEto(): Promise<IHttpResponse<TGeneralEtoData>> {
    return await this.authorizedHttpClient.post<TGeneralEtoData>({
      baseUrl: BASE_PATH,
      url: ETO_SUBMISSION_PATH,
    });
  }

  public async changeBookBuildingState(
    isBookBuilding: boolean,
  ): Promise<IHttpResponse<TGeneralEtoData>> {
    return await this.authorizedHttpClient.put<TGeneralEtoData>({
      baseUrl: BASE_PATH,
      url: ETO_BOOK_BUILDING_PATH,
      body: { is_bookbuilding: isBookBuilding },
    });
  }

  public getBookBuildingStats(etoId: string): Promise<IHttpResponse<any>> {
    return this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH + "/" + etoId + "/bookbuilding-stats",
    });
  }
}
