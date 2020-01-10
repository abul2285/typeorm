import { ObjectType, Field, Root, Ctx, ID } from "type-graphql";
import { Rocket } from "./Rocket";
import { Mission } from "./Mission";

@ObjectType()
export class Launch {
  // @Field(() => ObjectIdScalar)
  @Field(() => ID)
  id: number;

  @Field()
  site: String;

  @Field(() => Mission)
  mission: Mission;

  @Field(() => Rocket)
  rocket: Rocket;

  @Field(() => Boolean)
  isBooked(@Root() launch: Launch, @Ctx() { dataSources }: any) {
    return dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id });
  }
}
