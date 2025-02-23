import 'server-only'
import { delay } from './delay'
import { asc, eq } from 'drizzle-orm'
import { events } from '@/db/schema'
import { db } from '@/db/db'

export const getEventsForDashboard = async (userId:string) => {
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
}
