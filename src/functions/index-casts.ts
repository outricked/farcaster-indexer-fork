//import { getSSLHubRpcClient } from '@farcaster/hub-nodejs'

import got from 'got'
import {NEYNAR_API_KEY} from '../merkle.js'
import supabase from '../supabase.js'
import {NeynarCast, NeynarFeedResponse} from '../types'
import {breakIntoChunks} from '../utils.js'

/**
 * Index the casts from all Farcaster profiles and insert them into Supabase
 * @param limit The max number of recent casts to index
 */
export async function indexAllCasts(limit?: number) {
  const startTime = Date.now()
  // build get all casts again using hub event processing
  const allCasts = await getAllCasts(limit)
  const cleanedCasts = cleanCasts(allCasts)

  // Break formattedCasts into chunks of 1000
  const chunks = breakIntoChunks(cleanedCasts, 1000)

  // Upsert each chunk into the Supabase table
  for (const chunk of chunks) {
    const { error } = await supabase.from('casts').upsert(chunk, {
      onConflict: 'hash',
    })

    if (error) {
      throw error
    }
  }

  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000

  if (duration > 60) {
    // If it takes more than 60 seconds, log the duration, so we can optimize
    console.log(`Updated ${cleanedCasts.length} casts in ${duration} seconds`)
  }
}

interface NeynarParams {
  api_key: string;
  fid?: string;
  feed_type?: string;
  filter_type?: string;
  parent_url?: string;
  fids?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Get the latest casts from the Merkle API. 100k casts every ~35 seconds on local machine.
 * @param limit The maximum number of casts to return. If not provided, all casts will be returned.
 * @returns An array of all casts on Farcaster
 */
export async function getAllCasts(limit?: number): Promise<NeynarCast[]> {
  const allCasts: NeynarCast[] = []
  let params: NeynarParams = {
    api_key: NEYNAR_API_KEY,
    feed_type: "filter",
    filter_type: "parent_url",
    parent_url: "chain://eip155:7777777/erc721:0x5a5ddb8a2d1ee3d8e9fd59785da88d573d1a84fe",
    limit: 150
  }

  while (true) {
    const _response = await buildCastEndpointNeynar(params)

    const response = _response as NeynarFeedResponse
    const casts = response.casts

    if (!casts) throw new Error('No casts found')

    for (const cast of casts) {
      allCasts.push(cast)
    }

    // If limit is provided, stop when we reach it
    if (limit && allCasts.length >= limit) {
      break
    }

    // If there are more casts, get the next page
    const cursor = response.next?.cursor
    if (cursor) {
      params = {
        api_key: NEYNAR_API_KEY,
        feed_type: "filter",
        filter_type: "parent_url",
        parent_url: "chain://eip155:7777777/erc721:0x5a5ddb8a2d1ee3d8e9fd59785da88d573d1a84fe",
        limit: 150,
        cursor: cursor
      }
    } else {
      break
    }
  }

  return allCasts
}


/**
 * Helper function to get casts from Neynar
 * @param params
 */
async function buildCastEndpointNeynar(params: NeynarParams):  Promise<JSON>{
  const endpoint = "https://api.neynar.com/v2/farcaster/feed"
  // Filter out undefined properties from params
  const definedParams: Record<string, string | number> = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
  );
  const response = await got(endpoint, {searchParams: definedParams})
  return JSON.parse(response.body)
}

function cleanCasts(casts: NeynarCast[]): NeynarCast[] {
  const cleanedCasts: NeynarCast[] = []

  for (const cast of casts) {
    // Remove recasts
    if (cast.text.startsWith('recast:farcaster://')) continue
    // TODO: find way to remove deleted casts
    cleanedCasts.push(cast)
  }

  return cleanedCasts
}