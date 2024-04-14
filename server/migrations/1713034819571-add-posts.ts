import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPosts1713034819571 implements MigrationInterface {
  name = 'AddPosts1713034819571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "post" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying NOT NULL,
        "alias" character varying NOT NULL,
        "content" character varying NOT NULL,
        "author_id" uuid NOT NULL,
        CONSTRAINT "UQ_394783ef3bf52330ce2a8b1d352" UNIQUE ("alias"),
        CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "post"
      ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id")
      REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"`,
    );

    await queryRunner.query(`DROP TABLE "post"`);
  }
}
