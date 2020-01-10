import { ObjectType, Field, registerEnumType, Arg } from "type-graphql";

enum PatchSize {
  SMALL = "SMALL",
  LARGE = "LARGE"
}

registerEnumType(PatchSize, {
  name: "PatchSize"
});

@ObjectType()
export class Mission {
  @Field()
  name: String;

  @Field(() => String)
  missionPatch(@Arg("size", { defaultValue: "LARGE" }) size: string = "LARGE") {
    return size === "SMALL" ? PatchSize.SMALL : PatchSize.LARGE;
  }
}
