import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, settings } from './utils/constants';

const events = new EventEmitter();

const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

console.log('--- ТЕСТИРОВАНИЕ КАТАЛОГА ---');
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());

const testProduct = catalog.getItems()[0];
if (testProduct) {
    console.log('Получение одного товара по id:', catalog.getProduct(testProduct.id));
    
    catalog.setPreviewProduct(testProduct);
    console.log('Сохраненный товар для превью:', catalog.getPreviewProduct());
}

console.log('--- ТЕСТИРОВАНИЕ КОРЗИНЫ ---');
const product1 = catalog.getItems()[1];
const product2 = catalog.getItems()[2];

if (product1 && product2) {
    cart.addProduct(product1);
    cart.addProduct(product2);
    console.log('Корзина после добавления товаров:', cart.getProducts());
    console.log('Сумма стоимости товаров:', cart.getTotalPrice());
    console.log('Количество товаров в корзине:', cart.getTotalCount());
    console.log('Добавлен ли в корзину первый товар:', cart.contains(product1.id));
    cart.removeProduct(product2.id);
    console.log('Корзина после удаления второго товара:', cart.getProducts());
    cart.clear();
    console.log('Товары в корзине после очистки:', cart.getProducts());
}

console.log('--- ТЕСТИРОВАНИЕ ПОКУПАТЕЛЯ ---');
console.log('Данные до заполнения:', buyer.getData());

console.log('Частичное заполнение');
buyer.setField('payment', 'cash');
buyer.setField('email', 'test@example.com');
console.log('Данные частично заполненной формы:', buyer.getData());
console.log('Валидация частично заполненной формы:', buyer.validate());
console.log('Ошибки частично заполненной формы:', buyer.formErrors);

buyer.clear();
console.log('Данные после очистки:', buyer.getData());

buyer.setField('payment', 'card');
buyer.setField('email', 'test@test.ru');
buyer.setField('phone', '+71234567890');
buyer.setField('address', 'г. Москва, ул. Ленина, д. 2');

console.log('Данные после заполнения:', buyer.getData());
console.log('Валидация заполненной формы:', buyer.validate());
console.log('Ошибки в заполненной форме:', buyer.formErrors);

const baseApi = new Api(API_URL, settings);

const api = new LarekApi(API_URL, baseApi);

console.log('--- ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ---');

api.getProductList()
    .then((products) => {
        console.log('Данные успешно получены с сервера!');
        catalog.setItems(products);
        console.log('Товары в модели каталога:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });