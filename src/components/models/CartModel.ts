import { IProduct } from '../../types';

export class CartModel {
    protected items: IProduct[] = [];

    constructor() {
        
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    addProduct(item: IProduct): void {
        if (!this.contains(item.id)) {
            this.items.push(item);
        }
    }

    removeProduct(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clear(): void {
        this.items = [];
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