import { User } from "../entity/User";
const isEmail = require("isemail");
// import { MongoDataSource } from 'apollo-datasource-mongodb'
import { RESTDataSource } from "apollo-datasource-rest";

export class userAPI extends RESTDataSource {
  // export class userAPI extends MongoDataSource {
  constructor() {
    super();
  }

  // initialize(config: any) {
  //   this.context = config.context;
  // }

  // getUser(userId: any) {
  //   return this.findOneById(userId);
  // }

  async findOrCreateUser({ email: emailArg }: any = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const user = await User.find({ where: { email } });
    return user;
  }

  async bookTrip(launchId: number) {
    console.log(launchId);
    const userId = this.context.user.id;
    const res = await User.find({
      where: { userId, launchId }
    });
    if (!res) return false;
    return res;
  }

  async bookTrips(launchIds: number[]) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip(launchId);
      if (res) results.push(res);
    }

    return results;
  }

  //  async getLaunchIdsByUser() {
  //    const userId = this.context.user.id;
  //    const found = await this.store.trips.findAll({
  //      where: { userId }
  //    });
  //    return found && found.length
  //      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
  //      : [];
  //  }

  async isBookedOnLaunch() {
    return true;
  }
}
