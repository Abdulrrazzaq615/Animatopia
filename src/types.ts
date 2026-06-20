export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location: string;
  badges: string[];
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
}

export type WatchlistStatus = 'plan_to_watch' | 'watching' | 'completed' | 'dropped';

export interface WatchlistItem {
  id: string;
  userId: string;
  animeId: string;
  status: WatchlistStatus;
  progress: number;
  maxEpisodes: number;
  rating?: number; // 1-10
  updatedAt: string;
}

export interface Anime {
  id: string;
  title: string;
  englishTitle: string;
  synopsis: string;
  genres: string[];
  episodes: number;
  status: 'Airing' | 'Completed' | 'Upcoming';
  imageUrl: string;
  bannerUrl: string;
  ratingAverage: number;
  popularity: number;
}

export interface PostReaction {
  emoji: string;
  count: number;
  label: string;
  userIds: string[];
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  songTitle?: string;
  videoEffect?: string;
  createdAt: string;
  likesCount: number;
  isLikedByUser: boolean;
  comments: Comment[];
  reactions?: Record<string, PostReaction>;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  createdBy: string;
  imageUrl: string;
  joined?: boolean;
}

export interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  rsvpCount: number;
  userRsvp?: 'going' | 'maybe' | 'not_going' | null;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string; // If empty, it's a group message
  groupId?: string;
  content: string;
  createdAt: string;
}
