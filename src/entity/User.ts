import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Ctx } from "type-graphql";
import { Launch } from "./Launch";
// import { ObjectIdScalar } from "../utils/mongoId";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  email: String;

  @Field(() => Launch)
  @Column(() => Launch)
  async trips(@Ctx() { dataSources }: any) {
    const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

    if (!launchIds.length) return [];

    return (
      dataSources.launchAPI.getLaunchesByIds({
        launchIds
      }) || []
    );
  }
}
