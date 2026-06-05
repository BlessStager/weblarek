import { BaseForm } from '../views/BaseForm';
import { IEvents } from '../base/Events';

export interface IContactsForm {
    phone: string;
    email: string;
}

export class ContactsForm extends BaseForm<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}