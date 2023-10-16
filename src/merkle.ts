if (!process.env["API_KEY"]) {
  console.error('Missing NEYNAR API KEY environment variables')
}

export const NEYNAR_API_KEY = process.env["API_KEY"] as string
export const MERKLE_REQUEST_OPTIONS = {}