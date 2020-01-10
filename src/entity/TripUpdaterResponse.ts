import { ObjectType, Field } from "type-graphql";
import { Launch } from "./Launch";

@ObjectType()
export class TripUpdateResponse {
  @Field()
  success: boolean;

  @Field()
  message: String;

  @Field(() => Launch)
  launches: Launch[];
}
