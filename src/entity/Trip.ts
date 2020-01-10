import { Field, ID } from "type-graphql";
import {
  ObjectID,
  ObjectIdColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Trip {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
