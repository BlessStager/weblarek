import { CardBase, ICardData } from './CardBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardPreviewData extends ICardData {
    category: string;
    image: string;
    imageAlt: string;
    description: string;
    inCart: boolean;
}

export class CardPreview extends CardBase<ICardPreviewData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected actionButton: HTMLButtonElement;
    protected inCartFlag: boolean = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.actionButton.addEventListener('click', () => {
            if (this.inCartFlag) {
                this.events.emit('card:remove', { id: this.productId });
            } else {
                this.events.emit('card:buy', { id: this.productId });
            }
        });
    }

    set image(src: string) {
        this.setImage(this.imageElement, src);
    }
    
    set imageAlt(value: string) {
        this.imageElement.alt = value;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';

        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.classList.add(categoryClass);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.actionButton.disabled = true;
            this.actionButton.textContent = 'Недоступно';
        }
    }

    set inCart(value: boolean) {
        this.inCartFlag = value;
        if (!this.actionButton.disabled) {
            this.actionButton.textContent = value ? 'Удалить из корзины' : 'Купить';
        }
    }
}