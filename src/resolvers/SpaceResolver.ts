import { Resolver, Query, Arg, Mutation, Ctx, ID, InputType, Field } from "type-graphql";
import { Launch } from "../entity/Launch";
import { User } from "../entity/User";
import { paginateResults } from "../utils";
import { LaunchConnection } from "../entity/LaunchConnection";
import { TripUpdateResponse } from "../entity/TripUpdaterResponse";

@InputType()
class userInput{
  @Field()
  email:string
}

@Resolver()
export class SpaceResolver {
  @Query(() => String)
  hello() {
    return "hi from space resolver";
  }

  @Query(() => User)
  async me(@Arg("email") email: string) {
    const user = await User.find({ email });
    return user;
  }

  @Query(() => LaunchConnection)
  async launches(
    @Arg("pageSize", { nullable: true }) pageSize: number,
    @Arg("after", { nullable: true }) after: string,
    @Ctx() { dataSources }: any
  ): Promise<LaunchConnection> {
    const allLaunches = await dataSources.launchAPI.getAllLaunches();
    // we want these in reverse chronological order
    allLaunches.reverse();
    const launches = paginateResults({
      after,
      pageSize,
      results: allLaunches
    });
    return {
      launches,
      cursor: launches.length ? launches[launches.length - 1].cursor : null,
      // if the cursor of the end of the paginated results is the same as the
      // last item in _all_ results, then there are no more results after this
      hasMore: launches.length
        ? launches[launches.length - 1].cursor !==
          allLaunches[allLaunches.length - 1].cursor
        : false
    };
  }

  @Query(() => Launch)
  async launch(
    @Arg("id", () => ID) id: number,
    @Ctx() { dataSources }: any
  ): Promise<Launch> {
    console.log(dataSources);
    return dataSources.launchAPI.getLaunchById(id);
  }

  @Mutation(() => String)
  async login(@Arg("email",()=>userInput) {email}: userInput, @Ctx() { dataSources }: any) {
    const user = await dataSources.userAPI.findOrCreateUser({ email });
    if (user) return Buffer.from(email).toString("base64");
    return "user not found";
  }

  @Mutation(() => TripUpdateResponse)
  async bookTrips(
    @Arg("launchIds", () => [ID]) launchIds: number[],
    @Ctx() { dataSources }: any
  ): Promise<TripUpdateResponse> {
    const results = await dataSources.userAPI.bookTrips(launchIds);
    console.log(typeof results);
    const launches = await dataSources.launchAPI.getLaunchesByIds(launchIds);
    return {
      success: results && results.length === launchIds.length,
      message:
        results.length === launchIds.length
          ? "trips booked successfully"
          : `the following launches couldn't be booked: ${launchIds.filter(
              (id: any) => !results.includes(id)
            )}`,
      launches
    };
  }

  @Mutation(() => Boolean)
  async register(@Arg("email") email: string) {
    try {
      await User.insert({
        email
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  // bookTrips: async (_, { launchIds }, { dataSources }) => {
  //   const results = await dataSources.userAPI.bookTrips({ launchIds });
  //   const launches = await dataSources.launchAPI.getLaunchesByIds({
  //     launchIds,
  //   });
  // login: async (_, { email }, { dataSources }) => {
  //   const user = await dataSources.userAPI.findOrCreateUser({ email });
  //   if (user) return Buffer.from(email).toString('base64');
  // }
  //   type Mutation {
  //   # if false, booking trips failed -- check errors
  //   bookTrips(launchIds: [ID]!): TripUpdateResponse!

  //   # if false, cancellation failed -- check errors
  //   cancelTrip(launchId: ID!): TripUpdateResponse!

  //   login(email: String): String # login token
  // }
}
