import { Command, CommandOptions } from "./command.ts";

export type GeoAddCommandOptions = (
  | { nx: true; xx?: never }
  | { nx?: never; xx: true }
  | { nx?: never; xx?: never }
) & { ch?: true };

/**
 * This type is defiend up here because otherwise it would be automatically formatted into
 * multiple lines by Deno. As a result of that, Deno will add a comma to the end and then
 * complain about the comma being there...
 */
type Arg2<TData> = GeoMember<TData> | GeoAddCommandOptions;
export type GeoMember<TData> = {
  longitude: number;
  latitude: number;
  member: TData;
};

/**
 * @see https://redis.io/commands/geoadd
 */
export class GeoAddCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [
      key: string,
      geoMember: GeoMember<TData>,
      ...geoMemberPairs: GeoMember<TData>[]
    ],
    opts?: CommandOptions<number, number>
  );
  constructor(
    cmd: [
      key: string,
      geoOpts: GeoAddCommandOptions,
      ...geoMemberPairs: GeoMember<TData>[]
    ],
    opts?: CommandOptions<number, number>
  );
  constructor(
    [key, arg1, ...arg2]: [string, Arg2<TData>, ...GeoMember<TData>[]],
    opts?: CommandOptions<number, number>
  ) {
    const command: unknown[] = ["geoadd", key];

    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }
    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }

    if ("longitude" in arg1 && "latitude" in arg1 && "member" in arg1) {
      command.push(arg1.longitude, arg1.latitude, arg1.member);
    }

    command.push(
      ...arg2.flatMap(({ longitude, latitude, member }) => [
        longitude,
        latitude,
        member,
      ])
    );

    super(command, opts);
  }
}
