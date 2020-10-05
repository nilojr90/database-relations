import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import { isNull } from "util";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

export class addCustomerIdToOrders1601928521688 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn(
        {
          name: 'customer_id',
          type: 'uuid',
          isNullable: true,
        }
      )

    )


    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'fk_orders_customer',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'SET NULL',

      })

    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'orders',
      'fk_orders_customer'
    );

    await queryRunner.dropColumn(
      'orders',
      'customer_id'
    )
  }

}
