const MERKLE_SECRET = process.env.MERKLE_SECRET

if (!MERKLE_SECRET) {
  console.warn('Missing Merkle environment variables')
}

export const MERKLE_HEADERS = {
  Authorization: `Bearer ${MERKLE_SECRET}`,
  'Content-Type': 'application/json',
}

export const MERKLE_REQUEST_OPTIONS = {
  headers: MERKLE_HEADERS,
}
