import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICardData {
    title: string;
    price: number | null;
    id: string;
}

export class CardBase<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected productId: string = '';

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно'; 
        } else {
            this.priceElement.textContent = String(value) + ' синапсов';
        }
    }

    set id(value: string) {
        this.productId = value;
    }
}