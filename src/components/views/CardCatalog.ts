import { CardBase, ICardData, ICardActions  } from './CardBase';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardCatalogData extends ICardData {
    category: string;
    image: string;
    imageAlt: string;
}

export class CardCatalog extends CardBase<ICardCatalogData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';

        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.classList.add(categoryClass);
    }

    set image(src: string) {
        this.setImage(this.imageElement, src);
    }

    set imageAlt(value: string) {
        this.imageElement.alt = value;
    }
}