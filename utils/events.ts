import 'server-only'
import { delay } from './delay'
import { and, asc, eq } from 'drizzle-orm'
import { events } from '@/db/schema'
import { db } from '@/db/db'
import { memoize } from 'nextjs-better-unstable-cache'


export const getEventsForDashboard = memoize(
  async (userId:string) => {
    await delay()

    const data = await db.query.events.findMany({
      where: eq(events.createdById, userId),
      columns: {
        id: true,
        name: true,
        startOn: true,
        status: true,
      },
      with: {
        rsvps: true,
      },
      limit: 5,
      orderBy: [asc(events.startOn)],
    })

    return data ?? []
  },
  {
    revalidateTags: () => ['dashboard:events'],
    persist: true,
  }
)

export const getAllEvents = memoize(
  async (userId:string) => {
    await delay()
    return db.query.events.findMany({
      where: eq(events.createdById, userId),
      orderBy: [asc(events.startOn)]
    })
  },
  {
    persist: true,
    revalidateTags: () => ['events'],
    suppressWarnings: true,
    logid: 'events',
  }
)

export const getOneEvent = memoize(
  async (userId:string, eventId:string) => {
    await delay()
    return db.query.events.findFirst({
      where: and(eq(events.createdById, userId), eq(events.id, eventId)),
    })
  },
  {
    persist: true,
    revalidateTags: (userId, eventId) => ['events', eventId],
    suppressWarnings: true,
    logid: 'events',
  }
)
