import { IApi } from '../types';
import { IOrder, IOrderResult, IProductListResponse } from '../types';


export class LarekApi {
    private baseApi: IApi;

    constructor(baseApi: IApi) {
        this.baseApi = baseApi;
    }

    getProductList(): Promise<IProductListResponse> {
        return this.baseApi.get<IProductListResponse>('/product/');
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.baseApi.post<IOrderResult>('/order/', order);
    }
}