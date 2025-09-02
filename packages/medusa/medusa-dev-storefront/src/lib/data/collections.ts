"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { safeFetch } from "@lib/util/graceful-error"

export const retrieveCollection = async (id: string) => {
  return safeFetch(
    async () => {
      const next = {
        ...(await getCacheOptions("collections")),
      }

      return sdk.client
        .fetch<{ collection: HttpTypes.StoreCollection }>(
          `/store/collections/${id}`,
          {
            next,
            cache: "force-cache",
          }
        )
        .then(({ collection }) => collection)
    },
    null
  )
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  return safeFetch(
    async () => {
      const next = {
        ...(await getCacheOptions("collections")),
      }

      queryParams.limit = queryParams.limit || "100"
      queryParams.offset = queryParams.offset || "0"

      return sdk.client
        .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
          "/store/collections",
          {
            query: queryParams,
            next,
            cache: "force-cache",
          }
        )
        .then(({ collections }) => ({ collections, count: collections.length }))
    },
    { collections: [], count: 0 }
  )
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  return safeFetch(
    async () => {
      const next = {
        ...(await getCacheOptions("collections")),
      }

      return sdk.client
        .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
          query: { handle, fields: "*products" },
          next,
          cache: "force-cache",
        })
        .then(({ collections }) => collections[0])
    },
    null
  )
}
