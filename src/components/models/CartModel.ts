import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CartModel {
    protected items: IProduct[] = [];

    constructor(protected events: IEvents) {
        
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    addProduct(item: IProduct): void {
        if (!this.contains(item.id)) {
            this.items.push(item);
            this.events.emit('basket:change');
        }
    }

    removeProduct(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basket:change');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:change');
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getTotalCount(): number {
        return this.items.length;
    }

    contains(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}