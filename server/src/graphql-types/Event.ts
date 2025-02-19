import { events_venue_type_enum } from '@prisma/client';
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Chapter, EventSponsor, EventUserWithRelations, Venue } from '.';

export { events_venue_type_enum };

registerEnumType(events_venue_type_enum, {
  name: 'VenueType',
  description: 'All possible venue types for an event',
});

@ObjectType()
export class Event extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  streaming_url?: string | null;

  @Field(() => events_venue_type_enum)
  venue_type: events_venue_type_enum;

  @Field(() => Date)
  start_at: Date;

  @Field(() => Date)
  ends_at: Date;

  @Field(() => Boolean)
  canceled: boolean;

  @Field(() => Int)
  capacity: number;

  @Field(() => Boolean)
  invite_only: boolean;

  @Field(() => String)
  image_url: string;

  @Field(() => String, { nullable: true })
  calendar_event_id?: string | null;
}

@ObjectType()
export class EventWithChapter extends Event {
  @Field(() => Chapter)
  chapter: Chapter;
}

@ObjectType()
export class PaginatedEventsWithTotal {
  @Field(() => Int)
  total: number;

  @Field(() => [EventWithChapter])
  events: EventWithChapter[];
}

@ObjectType()
export class EventWithRelations extends Event {
  @Field(() => Chapter)
  chapter: Chapter;

  @Field(() => [EventSponsor])
  sponsors: EventSponsor[];

  @Field(() => Venue, { nullable: true })
  venue?: Venue | null;

  @Field(() => [EventUserWithRelations])
  event_users: EventUserWithRelations[];
}

@ObjectType()
export class EventWithVenue extends Event {
  @Field(() => Venue, { nullable: true })
  venue?: Venue | null;
}
