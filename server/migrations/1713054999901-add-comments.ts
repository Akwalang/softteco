import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComments1713054999901 implements MigrationInterface {
  name = 'AddComments1713054999901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "comment" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "message" character varying NOT NULL,
        "post_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_8aa21186314ce53c5b61a0e8c9" ON "comment" ("post_id") `,
    );

    await queryRunner.query(`
      ALTER TABLE "comment"
      ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id")
      REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "comment"
      ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id")
      REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_8aa21186314ce53c5b61a0e8c9"`);
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
