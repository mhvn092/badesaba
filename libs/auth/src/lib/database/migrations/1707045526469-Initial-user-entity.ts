import { MigrationInterface, MongoRepository, QueryRunner } from "typeorm";
import { UserEntity } from "../entities/person/user";
import { BadgeEnum } from "@lib/shared";

export class InitialUserEntity1707045526469 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository: MongoRepository<UserEntity> =
        queryRunner.connection.getRepository(UserEntity);

        await userRepository.save({
            email:'admin@gmail.com',
            password: '$2b$10$bHn1KNcRtKqJsT8CXaRrwuKdcoXv5uxx7YJ4hWzhPC/xJ6Uunr2Ci',
            badge:BadgeEnum.Admin,
            firstName: 'super',
            lastName: 'user',
            isActive:true,
            isVerified:true
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // not needed
    }

}
