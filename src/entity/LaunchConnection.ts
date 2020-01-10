import { ObjectType, Field } from "type-graphql";
import { Launch } from "./Launch";

@ObjectType()
export class LaunchConnection {
  @Field()
  cursor: string;

  @Field()
  hasMore: boolean;

  @Field(() => Launch)
  launches: Launch[];
}
