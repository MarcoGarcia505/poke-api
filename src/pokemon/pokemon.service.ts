import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  
  private defaultLimit: number;
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    // we can use the variables validated for the config service of nestjs
    private readonly configService: ConfigService
  ){
    this.defaultLimit = configService.get('defaultLimit') // get parameter from .env 
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const createPokemon = await this.pokemonModel.create(createPokemonDto)
      return createPokemon;
    } catch (error) {
      if (error.code === 11000) {
        console.log(error);
        throw new BadRequestException(`Error with data ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error);
      throw new InternalServerErrorException("Can't create pokemon, check logs please")
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto
    return this.pokemonModel.find()
            .limit(limit)
            .skip(offset)
            .sort({no: 1})
            .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    console.log(!isNaN(+id));
    
    if(!isNaN(+id)){
      console.log("into number");
      
      pokemon = await this.pokemonModel.findOne({no: id});
    }

    if (isValidObjectId(id)) {
      console.log("into wiht mongose id", id);
      
      pokemon = await this.pokemonModel.findById(id);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: id})
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokempn with id, name or no ${id} not found`)
    }
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    
    try {
      const pokemon = await this.findOne(id);
      await pokemon.updateOne(updatePokemonDto)
      console.log("data pokemopn",pokemon);
      
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Error with data ${JSON.stringify(error.keyValue)} exist`)
      }
      console.log(error);
      throw new InternalServerErrorException("Error in the update");
    }
  }

  async remove(id: string) {
      const deletePokemon = await this.pokemonModel.deleteOne({_id: id})
      
      if (deletePokemon.deletedCount === 0) {
        throw new BadRequestException("id not found")
      }

      return {mssage: "Pokemon deleted"}
  }
}
