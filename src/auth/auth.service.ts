import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import * as bcrypt from 'bcrypt';

import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
      private readonly  jwtService: JwtService,
      @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
    }

    async validateUser (email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({email}).exec()
        if(user && (await bcrypt.compare(password, user.password))){
            const {password, ...result} = user.toObject();
            return result

        }
        return null
    }

    async login (user: any){
        const payload = {email: user.email, id: user._id};
        return {
            tokenValidation: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
            }
        }
    }


    async register(email: string, password:string): Promise<any> {
        const hashedPassword = await bcrypt.hash(password, 8);
        const NewUser = new this.userModel({email, password: hashedPassword})
        return NewUser.save()
    }



}
