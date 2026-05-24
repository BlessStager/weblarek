import { IProduct } from '../../types';

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor() {
        
    }

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreviewProduct(item: IProduct): void {
        this.preview = item;
    }

    getPreviewProduct(): IProduct | null {
        return this.preview;
    }
}