import 'server-only'
import { delay } from './delay'
import { db } from '@/db/db'
import { desc, eq, inArray } from 'drizzle-orm'
import { attendees, events, rsvps } from '@/db/schema'

export const getRsvpsForDashboard = async (userId:string) => {
  await delay

  const userEvents = await db.query.events.findMany({
    where: eq(events.createdById, userId),
    columns: {
      id: true,
    },
  })

  const userEventIds = userEvents.map((event) => event.id)
  if (!userEventIds.length) return []

  const data = await db
    .selectDistinct()
    .from(attendees)
    .where(inArray(rsvps.eventId, userEventIds))
    .leftJoin(rsvps, eq(attendees.id, rsvps.attendeeId))
    .leftJoin(events, eq(rsvps.eventId, events.id))
    .orderBy(desc(rsvps.createdAt))
    .execute()

  return data
}
