export interface MerkleResponse {
  result: {
    casts?: NeynarCast[]
    users?: Profile[]
    verifications?: Verification[]
  }
  next?: {
    cursor: string
  }
}

export interface NeynarFeedResponse {
  casts?: NeynarCast[]
  next?: {
    cursor: string
  }
}

interface PFP {
  url: string
  verified: boolean
}

interface ProfileCore {
  fid: number
  username: string
  displayName: string
  pfp?: PFP
}

export interface Profile {
  fid: number
  username?: string
  displayName?: string
  pfp?: PFP
  profile?: {
    bio: {
      text: string
      mentions: any[]
    }
  }
  followerCount?: number
  followingCount?: number
  referrerUsername?: string
}

export interface NeynarCast {
  hash: string
  threadHash: string | null
  parentHash: string | null
  parentUrl: string | null
  parent_author: string | null
  author: {
    fid: number
    custodyAddress: string | null
    username: string | null
    displayName: string | null
    pfp_url: string | null
    profile?: {
      bio: {
        text: string
      }
    }
    followerCount?: number
    followingCount?: number
    verifications: [string]
    activeStatus: string
  }
  text: string
  timestamp: number
  embeds: Embed[]
  replies: {
    count: number
  }
  reactions: {
    likes: Like[]
    recasts: Recast[]
  }
}

export interface Like {
  fids: number
}

export interface Recast {
  fids: number
  fname: string
}
export interface Embed {
  url: string | null
}
export interface Verification {
  fid: number
  address: string
  timestamp: number
}

export interface FlattenedProfile {
  id: number
  owner?: string | null
  username?: string | null
  display_name?: string | null
  avatar_url?: string | null
  avatar_verified?: boolean | null
  followers?: number | null
  following?: number | null
  bio?: string | null
  referrer?: string | null
  registered_at?: Date
  updated_at?: Date
}

export interface FlattenedCast {
  hash: string
  thread_hash: string | null
  parent_hash: string | null
  parent_url: string | null
  author_fid: number
  author_username: string | null
  author_display_name: string
  author_pfp_url: string | null
  author_pfp_verified: boolean | null
  text: string
  published_at: Date
  mentions: ProfileCore[] | null
  replies_count: number
  reactions_count: number
  recasts_count: number
  deleted: boolean
}

export interface FlattenedVerification {
  fid: number
  address: string
  created_at: Date
}
