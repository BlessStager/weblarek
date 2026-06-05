import { CardBase, ICardData, ICardActions } from './CardBase';
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

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.actionButton.addEventListener('click', actions.onClick);
        }
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

    set buttonTitle(value: string) {
        if (this.actionButton) {
            this.actionButton.textContent = value;
        }
    }

    set buttonIsDisabled(value: boolean) {
        if (this.actionButton) {
            this.actionButton.disabled = value;
        }
    }
}