import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Credential } from "./entities/credential.entity";

export const AppDataSource =new DataSource({
    type:'postgres',
    url: process.env.DATABASE_URL,
    synchronize:true,
    logging:false,
    entities:[User,Credential]
});