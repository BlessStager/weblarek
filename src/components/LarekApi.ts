import { IApi } from '../types';
import { IOrder, IOrderResult, IProductListResponse } from '../types';


export class LarekApi {
    private baseApi: IApi;
    readonly cdn: string;

    constructor(cdn: string, baseApi: IApi) {
        this.baseApi = baseApi;
        this.cdn = cdn;
    }

    getProductList(): Promise<IProductListResponse> {
        return this.baseApi.get<IProductListResponse>('/product/').then((data) => data);
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.baseApi.post<IOrderResult>('/order/', order).then((data) => data);
    }
}