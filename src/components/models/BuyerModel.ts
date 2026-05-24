import { IBuyer, TPayment } from '../../types';

export class BuyerModel {
    protected payment: TPayment | null = null;
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';

    constructor() {
        
    }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = (value === 'card' || value === 'cash') ? value : null;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'address') {
            this.address = value;
        }
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
    }

    validate(): { [key: string]: string } {
        const errors: { [key: string]: string } = {};

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