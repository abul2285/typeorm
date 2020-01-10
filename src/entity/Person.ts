import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Person {
  // @Field()
  // id: number;

  // @Field()
  // name: string;

  // @Field()
  // username: string;

  @Field()
  gender: string;

  @Field()
  email: string;
  
  @Field()
  phone: string;
}
