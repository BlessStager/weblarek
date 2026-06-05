import { BaseForm } from '../views/BaseForm';
import { IEvents } from '../base/Events';

export interface IOrderForm {
    payment: string;
    address: string;
}

export class OrderForm extends BaseForm<IOrderForm> {
    protected buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.buttons = Array.from(this.container.querySelectorAll('.button_alt'));

        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('forms:change', { 
                    field: 'payment',
                    value: button.name 
                });
            });
        });
    }

    set payment(name: string) {
        this.buttons.forEach(button => {
            if (button.name === name) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}