import './scss/styles.scss';
import { IBuyer, BuyerErrors } from './types';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, settings, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types/index'; //

const events = new EventEmitter();
const baseApi = new Api(API_URL, settings);
const api = new LarekApi(baseApi);

const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const orderFormView = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsFormView = new ContactsForm(cloneTemplate(contactsFormTemplate), events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
        events.emit('preview:action'); 
    }
});

const basketView = new Basket(cloneTemplate(basketTemplate), events);

const successView = new Success(cloneTemplate(successTemplate), events);


events.on('catalog:change', () => {
    const items = catalog.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        
        card.title = item.title;
        card.price = item.price;
        card.category = item.category;
        card.image = CDN_URL + item.image;
        return card.render();
    });
    
    gallery.catalog = items;
});

events.on('card:select', (item: IProduct) => {
    catalog.setPreviewProduct(item);
});

events.on('preview:change', () => {
    const product = catalog.getPreviewProduct();
    if (!product) return;
    
    const inCart = cart.contains(product.id);
    const isPriceless = product.price === null;
    
    cardPreview.buttonTitle = isPriceless ? 'Недоступно' : (inCart ? 'Убрать' : 'В корзину');
    cardPreview.buttonIsDisabled = isPriceless;
    
    modal.content = cardPreview.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image,
        description: product.description
    });
    modal.open();
});

events.on('preview:action', () => {
    const product = catalog.getPreviewProduct();
    if (!product) return;
    
    if (cart.contains(product.id)) {
        cart.removeProduct(product.id);
    } else {
        cart.addProduct(product);
    }
    
    modal.close(); 
});


events.on('basket:change', () => {
    header.counter = cart.getTotalCount();
    
    const product = catalog.getPreviewProduct();
    if (product) {
        const inCart = cart.contains(product.id);
        const isPriceless = product.price === null;
        cardPreview.buttonTitle = isPriceless ? 'Недоступно' : (inCart ? 'Убрать' : 'В корзину');
    }
    
    const items = cart.getProducts().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        
        card.index = index + 1;
        card.title = item.title;
        card.price = item.price;
        return card.render();
    });
    
    basketView.render({
        items: items,
        total: cart.getTotalPrice()
    });
});

events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

events.on('card:remove', (item: IProduct) => {
    cart.removeProduct(item.id);
});

events.on('basket:checkout', () => {
    buyer.clear(); 
    
    const currentData = buyer.getData();
    
    modal.content = orderFormView.render({
        address: currentData.address,
        payment: currentData.payment || '',
        validate: false,
        errors: '' 
    });
    modal.open();
});

events.on('forms:change', (data: { field: keyof IBuyer; value: string }) => {
    buyer.setField(data.field, data.value);
});

events.on('formErrors:change', (errors: BuyerErrors) => {
    const { payment, address, email, phone } = errors;
    
    const isOrderValid = !payment && !address;
    const isContactsValid = !email && !phone;
    
    const orderErrorsText = [payment, address].filter(Boolean).join('; ');
    const contactsErrorsText = [email, phone].filter(Boolean).join('; ');
    
    const currentData = buyer.getData();
    
    orderFormView.render({
        payment: currentData.payment || '', 
        address: currentData.address,
        validate: isOrderValid,
        errors: orderErrorsText
    });
    
    contactsFormView.render({
        phone: currentData.phone,
        email: currentData.email,
        validate: isContactsValid,
        errors: contactsErrorsText
    });
});

events.on('order:submit', () => {
    const currentData = buyer.getData();
    
    modal.content = contactsFormView.render({
        email: currentData.email,
        phone: currentData.phone,
        validate: false,
        errors: '' 
    });
});

events.on('contacts:submit', () => {
    const orderData = {
        ...buyer.getData(),
        total: cart.getTotalPrice(),
        items: cart.getProducts().map(item => item.id)
    };
    
    api.orderProducts(orderData)
    .then((result) => {
        cart.clear(); 
        
        successView.total = result.total;
        modal.content = successView.render();
    })
    .catch(console.error);
});

events.on('success:close', () => {
    modal.close();
});

console.log('--- ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ---');
api.getProductList()
    .then((res) => {
        console.log('Данные успешно получены с сервера!');
        catalog.setItems(res.items);
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });