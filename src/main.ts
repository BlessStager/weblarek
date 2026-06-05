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

events.on('catalog:change', () => {
    const items = catalog.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        card.id = item.id;
        card.title = item.title;
        card.price = item.price;
        card.category = item.category;
        card.image = CDN_URL + item.image;
        return card.render();
    });
    gallery.catalog = items;
});

events.on('card:select', (data: { id: string }) => {
    const product = catalog.getProduct(data.id);
    if (product) catalog.setPreviewProduct(product);
});

events.on('preview:change', () => {
    const product = catalog.getPreviewProduct();
    if (!product) return;
    
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = CDN_URL + product.image;
    card.description = product.description;
    
    card.inCart = cart.contains(product.id);
    modal.content = card.render();
    modal.open();
});

events.on('card:buy', (data: { id: string }) => {
    const product = catalog.getProduct(data.id);
    if (!product) return;
    
    if (cart.contains(product.id)) {
        cart.removeProduct(product.id);
    } else {
        cart.addProduct(product);
    }
    events.emit('preview:change'); 
});

events.on('basket:change', () => {
    header.counter = cart.getTotalCount();
});

events.on('basket:open', () => {
    const basketView = new Basket(cloneTemplate(basketTemplate), events);
    
    const items = cart.getProducts().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        card.id = item.id;
        card.index = index + 1;
        card.title = item.title;
        card.price = item.price;
        return card.render();
    });
    
    basketView.items = items;
    basketView.total = cart.getTotalPrice();
    
    modal.content = basketView.render();
    modal.open();
});

events.on('card:remove', (data: { id: string }) => {
    cart.removeProduct(data.id);
    events.emit('basket:open');
});

events.on('basket:checkout', () => {
    buyer.clear();
    modal.content = orderFormView.render({
        address: '',
        payment: '',
        validate: false,
        errors: ''
    });
    modal.open();
});

events.on('forms:change', (data: { field: keyof IBuyer; value: string }) => {
    buyer.setField(data.field, data.value);
    buyer.validate();
});

events.on('order:validation', (errors: BuyerErrors) => {
    const { payment, address, email, phone } = errors;
    
    const paymentAndAddressErrors = [payment, address].filter(Boolean).join('; ');
    const emailAndPhoneErrors = [email, phone].filter(Boolean).join('; ');

    orderFormView.validate = !paymentAndAddressErrors;
    orderFormView.errors = paymentAndAddressErrors;

    contactsFormView.validate = !emailAndPhoneErrors;
    contactsFormView.errors = emailAndPhoneErrors;
});

events.on('order:submit', () => {
    modal.content = contactsFormView.render({
        email: '',
        phone: '',
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
            
            const successView = new Success(cloneTemplate(successTemplate), events);
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