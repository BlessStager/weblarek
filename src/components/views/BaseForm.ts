import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBaseForm {
    validate: boolean;
    errors: string;
}

export class BaseForm<T> extends Component<Partial<T> & IBaseForm> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected container: HTMLFormElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.container = container;

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`forms:change`, {
                field,
                value
            });
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    set validate(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}