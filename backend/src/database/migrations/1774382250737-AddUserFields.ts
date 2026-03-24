import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1774382250737 implements MigrationInterface {
    name = 'AddUserFields1774382250737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    }

}
