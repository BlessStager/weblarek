import { IBuyer, TPayment, BuyerErrors  } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    protected payment: TPayment | null = null;
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';

    constructor(protected events: IEvents) {
        
    }
    
    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = (value === 'card' || value === 'cash') ? value : null;
        } else {
            this[field] = value;
        }
        
        this.events.emit('buyer:change');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:change'); 
    }

    validate(): BuyerErrors {
        const errors: BuyerErrors = {};

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

        return errors;
    }
}