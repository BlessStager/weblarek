import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:changed', this.items);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreviewProduct(item: IProduct): void {
        this.preview = item;
        this.events.emit('preview:changed', this.preview);
    }

    getPreviewProduct(): IProduct | null {
        return this.preview;
    }
}