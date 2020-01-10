import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Rocket {
  @Field(() => ID)
  id: number;

  @Field()
  name: String;

  @Field()
  type: String;
}
