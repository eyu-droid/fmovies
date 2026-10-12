'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getAuthSession } from "@/lib/auth"

export async function updateUser(formData: FormData, userId: string) {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (user) {
    if (formData) {
      const data: Record<string, string | null> = {}
      const email = formData.get("email") as string
      const name = formData.get("name") as string
      const username = formData.get("username") as string
      const about = formData.get("about") as string
      const location = formData.get("location") as string
      const github = formData.get("github") as string
      const twitter = formData.get("twitter") as string
      const linkden = formData.get("linkden") as string

      if (email) data.email = email
      if (name !== undefined) data.name = name || null
      if (username !== undefined) data.username = username || null
      if (about !== undefined) data.about = about || null
      if (location !== undefined) data.location = location || null
      if (github !== undefined) data.github = github || null
      if (twitter !== undefined) data.twitter = twitter || null
      if (linkden !== undefined) data.linkden = linkden || null

      const updatedUser = await db.user.update({
        where: { id: userId },
        data,
      })

      revalidatePath("/home/user/account")
      return updatedUser
    }
  }

  return { error: "Bad Request" }
}

export async function createMovieNight(formData: FormData) {
  const session = await getAuthSession()

  if (!session?.user?.email) {
    throw new Error("You must be signed in to create a watch party.")
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    throw new Error("User not found.")
  }

  const rawTitle = String(formData.get("title") ?? "").trim()
  const movieTitle = String(formData.get("movieTitle") ?? "").trim()
  const moviePosterPath = String(formData.get("moviePosterPath") ?? "").trim() || null
  const movieOverview = String(formData.get("movieOverview") ?? "").trim() || null
  const tmdbMovieId = String(formData.get("tmdbMovieId") ?? "").trim() || null
  const jellyfinServerUrl = String(formData.get("jellyfinServerUrl") ?? "").trim() || null
  const jellyfinItemId = String(formData.get("jellyfinItemId") ?? "").trim() || null
  const scheduledTimeRaw = String(formData.get("scheduledTime") ?? "").trim()
  const timezone = String(formData.get("timezone") ?? "UTC").trim() || "UTC"

  if (!movieTitle || !scheduledTimeRaw) {
    throw new Error("Movie and scheduled time are required.")
  }

  const scheduledTime = new Date(scheduledTimeRaw)
  if (Number.isNaN(scheduledTime.getTime())) {
    throw new Error("The selected time is invalid.")
  }

  const movieNight = await db.movieNight.create({
    data: {
      title: rawTitle || `${movieTitle} Movie Night`,
      description: String(formData.get("description") ?? "").trim() || null,
      movieTitle,
      moviePosterPath,
      movieOverview,
      tmdbMovieId,
      jellyfinServerUrl,
      jellyfinItemId,
      scheduledTime,
      timezone,
      organizerId: user.id,
      attendees: {
        create: [{ userId: user.id, status: "going" }],
      },
    },
  })

  revalidatePath("/home")
  revalidatePath("/home/movie-night")
  revalidatePath(`/home/movie-night/${movieNight.id}`)

  return { id: movieNight.id }
}

export async function joinMovieNight(movieNightId: string, status: "going" | "maybe" | "declined") {
  const session = await getAuthSession()

  if (!session?.user?.email) {
    throw new Error("You must be signed in to RSVP.")
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } })

  if (!user) {
    throw new Error("User not found.")
  }

  const existing = await db.movieNightAttendee.findUnique({
    where: {
      movieNightId_userId: {
        movieNightId,
        userId: user.id,
      },
    },
  })

  if (existing) {
    await db.movieNightAttendee.update({
      where: { id: existing.id },
      data: { status },
    })
  } else {
    await db.movieNightAttendee.create({
      data: {
        movieNightId,
        userId: user.id,
        status,
      },
    })
  }

  revalidatePath(`/home/movie-night/${movieNightId}`)
  revalidatePath("/home/movie-night")

  return { ok: true }
}
