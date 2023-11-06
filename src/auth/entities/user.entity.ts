import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
/*definimos esto coma un esquema para indicarlle a mongoose que podera manipular este tipo de datos,
 * asegurandonos que alguns campos sexan unicos
 * @prop() para grabar cada propiedade na base de datos, + engadirlle caracteristicas (requerido, unico, etc...)
 */
@Schema()
export class User {

    _id?: string;
    @Prop({unique:true, required:true})
    email: string;
    @Prop({required:true})
    name: string;
    @Prop({minlength:6, required:true})
    password?: string;
    @Prop({default: true})
    isActive: boolean;
    @Prop({type:[String], default: ['user']})
    roles: string[];

}
export const UserSchema = SchemaFactory.createForClass( User );
