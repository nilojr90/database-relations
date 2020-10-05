import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class addOrderIdToOrdersProducts1601929639746 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn(
        {
          name: 'order_id',
          type: 'uuid',
          isNullable: true,
        }
      )
    )

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey(
        {
          name: 'fk_order_products_order',
          columnNames: ['order_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onDelete: 'SET NULL',
        }
      )
    )


  }

  public async down(queryRunner: QueryRunner): Promise<any> {

    await queryRunner.dropForeignKey(
      'orders_products',
      'fk_order_products_order'
    );

    await queryRunner.dropColumn(
      'orders_products',
      'order_id'
    )
  }

}
