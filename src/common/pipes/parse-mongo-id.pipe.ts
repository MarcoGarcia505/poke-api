import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log(metadata);
    
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`This id is not id of mongo ${value}`)
    }

    return value;
  }
}
