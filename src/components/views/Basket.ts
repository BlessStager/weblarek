import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLUListElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        if (this.orderButton) {
            this.orderButton.addEventListener('click', () => {
                this.events.emit('basket:checkout');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.listElement.replaceChildren(...items);
            this.orderButton.disabled = false;
        } else {
            const p = document.createElement('p');
            p.textContent = 'Корзина пуста';
            this.listElement.replaceChildren(p);
            this.orderButton.disabled = true;
        }
    }

    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }
}