import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor(protected events: IEvents) {
        
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:change');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreviewProduct(item: IProduct): void {
        this.preview = item;
        this.events.emit('preview:change');
    }

    getPreviewProduct(): IProduct | null {
        return this.preview;
    }
}