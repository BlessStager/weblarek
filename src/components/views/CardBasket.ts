import { CardBase, ICardData } from './CardBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketData extends ICardData {
    index: number;
}

export class CardBasket extends CardBase<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('card:remove', { id: this.productId });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}