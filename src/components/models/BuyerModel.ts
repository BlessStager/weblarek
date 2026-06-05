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
        
        this.events.emit('formErrors:change', this.validate());
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
        this.events.emit('formErrors:change', this.validate()); 
    }

    validate(): BuyerErrors {
        const errors: BuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        return errors;
    }
}