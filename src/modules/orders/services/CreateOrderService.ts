import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customerExist = await this.customersRepository.findById(customer_id);

    if (!customerExist) {
      throw new AppError('Cliente não existe.');
    }

    const existentProducts = await this.productsRepository.findAllById(
      products
    );

    if (!existentProducts.length) {
      throw new AppError('Nenhum dos produtos foi encontrado');
    }

    const existentProductsIds = existentProducts.map(product => product.id);

    const invalidProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    if (invalidProducts.length) {
      throw new AppError(
        `Produto: ${invalidProducts[0].id} não existe.`
      )
    }

    const noAvaliableProducts = products.filter(
      product =>
        existentProducts.filter(existentProduct =>
          existentProduct.id === product.id)[0]
          .quantity < product.quantity
    )

    if (noAvaliableProducts.length) {
      throw new AppError(
        `Quantidade ${noAvaliableProducts[0].quantity}
        não disponivel para o produto: ${noAvaliableProducts[0].id}`
      )
    }

    const serializedProducts = products.map(
      product => ({
        product_id: product.id,
        quantity: product.quantity,
        price: existentProducts.filter(
          existentProduct => existentProduct.id === product.id)[0].price
      })
    )

    const order = await this.ordersRepository.create({
      customer: customerExist,
      products: serializedProducts
    })

    const { order_products } = order;

    const productsUpdateQuantity = order_products.map(
      product => ({
        id: product.product_id,
        quantity:
          existentProducts.filter(existentProduct =>
            existentProduct.id == product.product_id)[0]
            .quantity - product.quantity
      })
    )

    await this.productsRepository.updateQuantity(productsUpdateQuantity);

    return order;

  }
}

export default CreateOrderService;
