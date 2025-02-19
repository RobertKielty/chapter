import { inspect } from 'util';

import { prisma } from '../prisma';
import { Event } from '../graphql-types';
import { createCalendarEvent } from '../services/Google';
import { redactSecrets } from './redact-secrets';

interface CreateCalendarEventData {
  attendeeEmails: string[];
  calendarId: string;
  event: Pick<Event, 'id' | 'ends_at' | 'start_at' | 'name'>;
}

// TODO: consider pulling this back into the resolver (it's only used twice,
// it's not that complex so I don't think we need to abstract it out)
export const createCalendarEventHelper = async ({
  attendeeEmails,
  calendarId,
  event: { ends_at, id, name, start_at },
}: CreateCalendarEventData) => {
  try {
    const { calendarEventId } = await createCalendarEvent(
      {
        calendarId,
      },
      {
        start: start_at,
        end: ends_at,
        summary: name,
        attendees: attendeeEmails.map((email) => ({ email })),
      },
    );

    return await prisma.events.update({
      where: { id },
      data: { calendar_event_id: calendarEventId },
    });
  } catch (e) {
    console.error('Unable to create calendar event');
    console.error(inspect(redactSecrets(e), { depth: null }));
  }
};

export const integrationStatus = async () => {
  const tokens = await prisma.google_tokens.findMany();
  if (!tokens.length) return false;
  return tokens.some(({ is_valid }) => is_valid) ? true : null;
};
