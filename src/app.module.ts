import { join } from 'path';
import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './common/config/app.config';
import { JoiValidatorSchema } from './common/config/joi.validation';

@Module({
  imports: [
    // initializer config from .env
    ConfigModule.forRoot({
      load: [EnvConfiguration], // this option permit validate our variables of the .env
      validationSchema: JoiValidatorSchema // parse data and validate data
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    // Create connection with mongo -> first install mongosModule created by the team of nest js
    MongooseModule.forRoot(process.env.MONGODB ,{
      dbName: "pokemonDB"
    }),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(){
    // console.log(process.env);
  }
}
