import { getOneEvent } from "@/utils/events"
import { getCurrentUser } from "@/utils/user"
import { redirect } from "next/navigation"


const EventsPage = async ({params}) => {
  const user = await getCurrentUser()
  const event = await getOneEvent(user.id, params.id)

  if (!event) redirect(`/dashbaord/events`)

  return <div>{event.name}</div>
}

export default EventsPage
