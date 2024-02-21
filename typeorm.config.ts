import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ExRateEntity } from "src/entity/exrate.entity";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: "localhost",
    port: 3309,
    username: "root",
    database: "exrate",
    entities: [ExRateEntity],
    synchronize: true
}