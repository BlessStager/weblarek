import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    payment: TPayment | '' = '';
    email: string = '';
    phone: string = '';
    address: string = '';
    formErrors: Partial<Record<keyof IBuyer, string>> = {};
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = value as TPayment;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'address') {
            this.address = value;
        }
        
        this.validate();
    }

    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.formErrors = {};
    }

    validate(): boolean {
        const errors: typeof this.formErrors = {};

        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }
}