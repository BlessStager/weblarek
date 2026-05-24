import { Api } from './base/Api';
import { IOrder, IOrderResult, IProduct, IProductListResponse } from '../types';


export class LarekApi {
    private _baseApi: Api;
    readonly cdn: string;

    constructor(cdn: string, baseApi: Api) {
        this._baseApi = baseApi;
        this.cdn = cdn;
    }

    getProductList(): Promise<IProduct[]> {
        return this._baseApi.get('/product/').then((data: object) => {
            const response = data as IProductListResponse;
            
            return response.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }));
        });
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._baseApi.post('/order/', order).then((data: object) => data as IOrderResult);
    }
}