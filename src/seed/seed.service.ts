import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/pokemon.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapters';

@Injectable()
export class SeedService {
  
  constructor(
    // WE NEED IMPORT DE MONGO MODEL
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosAdapter: AxiosAdapter
  ){}
  
  // This is a dependency of axios 
  // private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    // delete all registers  
    await this.pokemonModel.deleteMany({});
    const data = await this.axiosAdapter.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=100&offset=100')
    
    // Option 1 -> create all registers
    // data.results.forEach(async ({name, url}) => {
    //   const numberPoke: number = +url.split('/').at(-2);
    //   await this.pokemonModel.create({name, no: numberPoke})
    // })

    // Option 2 -> create all registers
    // const promiseAllPokemons = []
    // data.results.forEach(async ({name, url}) => {
    //   const numberPoke: number = +url.split('/').at(-2);
    //   promiseAllPokemons.push(this.pokemonModel.create({name, no: numberPoke}))
    // })
    // await Promise.all(promiseAllPokemons);
  
    // Option 3 -> create all registers, this is the best option to create a array of registers 
    const dataAllPokemons = []
    data.results.forEach(({name, url}) => {
      const numberPoke: number = +url.split('/').at(-2);
      dataAllPokemons.push({name, no: numberPoke});
    })

    await this.pokemonModel.insertMany(dataAllPokemons)

    return 'registered all data'
  }
}