import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";

export class addProductIdToOrdersProducts1601930953430 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn(
        {
          name: 'product_id',
          type: 'uuid',
          isNullable: true,
        }
      )
    )

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey(
        {
          name: 'fk_order_products_product',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'SET NULL',
        }
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey(
      'orders_products',
      'fk_order_products_product'
    );

    await queryRunner.dropColumn(
      'orders_products',
      'product_id'
    )
  }

}
