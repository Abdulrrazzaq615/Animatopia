import { Anime, Post, Group, Event, User, Message } from './types';

export const CURRENT_USER: User = {
  id: 'current_user_kaimosi',
  username: 'otaku_amadi',
  displayName: 'Amadi Ken',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Just a Kaimosi techie passionate about Web dev, Shonen, and dark fantasy. Always ready for a watch party! 🇰🇪✨',
  location: 'Kaimosi, Kenya',
  badges: ['Kaimosi pioneer', 'Lover of Shonen', 'Meetup Regular'],
  followersCount: 142,
  followingCount: 98,
};

export const MOCK_USERS: User[] = [
  {
    id: 'user_wanjiku',
    username: 'otaku_wanjiku',
    displayName: 'Wanjiku Mary',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Cosplayer, sketch artist & massive Ghibli nerd. Catch me near Kaimosi Friends Univ drawing in my notebook! 🌸',
    location: 'Kaimosi, Kenya',
    badges: ['Cosplay Legend', 'Sketch Artist', 'Elite Otaku'],
    followersCount: 420,
    followingCount: 180,
    isFollowing: true,
  },
  {
    id: 'user_kiprop',
    username: 'kakashi_kiprop',
    displayName: 'Kiprop J.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Ninjustu expert in Kaimosi. Run a local gaming and anime screenings cafe. "A drop of ink may make a million think." 🔥⚔️',
    location: 'Kaimosi, Kenya',
    badges: ['Cafe Owner', 'Naruto Champion'],
    followersCount: 289,
    followingCount: 310,
    isFollowing: false,
  },
  {
    id: 'user_mwaniki',
    username: 'manga_mwaniki',
    displayName: 'Mwaniki Dennis',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Reading manga 24/7. Berserk and Vagabond are top-tier. Looking for peers to chat about Seinen layouts.',
    location: 'Chavakali, Western Kenya',
    badges: ['Manga Collector', 'Seinen Analyst'],
    followersCount: 110,
    followingCount: 90,
    isFollowing: false,
  },
];

export const MOCK_ANIME: Anime[] = [
  {
    id: 'anime_1',
    title: 'Ningendao no Shinjitsu',
    englishTitle: 'The Truth of Humanity',
    synopsis: 'In a dystopian world where humanity has migrated to floating airships, a young engineer stumbles upon ancient, glowing blueprints that point to an abandoned land beneath the clouds. Together with a renegade pilot, they embark on a journey that could unveil the origin of human civilization or trigger another cosmic cataclysm.',
    genres: ['Sci-Fi', 'Action', 'Adventure', 'Mystery'],
    episodes: 24,
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80',
    ratingAverage: 8.9,
    popularity: 14500,
  },
  {
    id: 'anime_2',
    title: 'Kaimosi Chrono-Trigger',
    englishTitle: 'Time-Shift Kaimosi',
    synopsis: 'A high school student from Kaimosi, Kenya finds a mysterious pocket watch in the tea fields near Chavakali. When wound, it shifts him exactly 12 hours into an alternate, magical dimension of Kaimosi populated by mythical East African spirits and cyberpunk technology. He must balance his schoolwork with protecting his hometown from temporal beasts.',
    genres: ['Fantasy', 'Slice of Life', 'Supernatural'],
    episodes: 12,
    status: 'Airing',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    ratingAverage: 9.4,
    popularity: 5400,
  },
  {
    id: 'anime_3',
    title: 'Spirit Bound: Katana',
    englishTitle: 'Spirit Bound',
    synopsis: 'After a tragic demon attack, a swordsman with a cursed heart pledges his life to dynamic hunting clans. Equipped with a spirit-guided blade that consumes the essence of the fallen, he tracks evil entities across a beautiful, hand-painted feudal landscape, seeking a cure for his sister before his own soul is consumed.',
    genres: ['Action', 'Fantasy', 'Historical'],
    episodes: 26,
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80',
    ratingAverage: 8.7,
    popularity: 28900,
  },
  {
    id: 'anime_4',
    title: 'Mecha-Force Alpha',
    englishTitle: 'Mecha Force Alpha',
    synopsis: 'In an alternate 1980s, giants made of iron guard the coastal cities. When a remote signal awakens dozens of sleeping massive subterranean mechas, a group of teenage prodigies is gathered onto a secretive military island to undergo neuro-sync training. They are the last line of defense against biological deep-sea invaders.',
    genres: ['Mecha', 'Action', 'Sci-Fi'],
    episodes: 50,
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    ratingAverage: 8.2,
    popularity: 18000,
  },
  {
    id: 'anime_5',
    title: 'Shinobi Scroll: Reborn',
    englishTitle: 'Shinobi Scroll: Reborn',
    synopsis: 'Centuries after the famous ninja wars, a young clan-less orphan discovers the legendary sealed parchment of the First Shadow. Hunted by corrupted corporate daimyo and highly trained modern ninja squads, he must unlock the legendary elements and rebuild a forgotten order of honorable peacekeepers.',
    genres: ['Action', 'Adventure', 'Martial Arts'],
    episodes: 12,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80',
    ratingAverage: 0.0,
    popularity: 8400,
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_wanjiku',
    content: 'Just finished my latest sketch of Mikasa Ackermann! What do you guys think? Should I paint it with watercolor or leave it monochromatic? 🎨 Will show this at the Kaimosi screening meetup this Friday! #KaimosiOtakus #AttackOnTitan',
    imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&q=80',
    createdAt: '2026-06-20T08:30:00-07:00',
    likesCount: 24,
    isLikedByUser: false,
    comments: [
      {
        id: 'c_1',
        userId: 'current_user_kaimosi',
        content: 'Bazuu! This is incredibly clean! I think monochromatic fits the raw gritty vibe of Mikasa perfectly. Canvas drawing on point. 🔥',
        createdAt: '2026-06-20T08:45:00-07:00',
      },
      {
        id: 'c_2',
        userId: 'user_kiprop',
        content: 'Leave it monochromatic! Also, Mary please bring it to the cafe on Friday, we can frame it on our community wall! 💯',
        createdAt: '2026-06-20T09:00:00-07:00',
      }
    ],
    reactions: {
      kawaii: { emoji: '🌸', count: 12, label: 'Kawaii', userIds: ['user_kiprop', 'user_mwaniki'] },
      hype: { emoji: '🔥', count: 8, label: 'Hype', userIds: ['user_kiprop'] },
      shocked: { emoji: '⚡', count: 4, label: 'Shocked', userIds: [] },
      feels: { emoji: '😭', count: 2, label: 'Feels', userIds: [] }
    }
  },
  {
    id: 'post_2',
    userId: 'user_kiprop',
    content: 'Big announcement! Weekly Anime Screening this Friday at 6 PM inside Kiprop Gaming & Anime Café. We are streaming the final episodes of Time-Shift Kaimosi! Entrance is free. Come buy a cold soda and support the local Kaimosi club! Sherehe is guaranteed. 🥤🔥 #Meetup #KaimosiAnime',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    createdAt: '2026-06-19T14:20:00-07:00',
    likesCount: 38,
    isLikedByUser: true,
    comments: [
      {
        id: 'c_3',
        userId: 'user_mwaniki',
        content: 'Chavakali squad represents! I will definitely take a matatu to Kaimosi for this. Unrelated: anyone reading Berserk chapter 372?',
        createdAt: '2026-06-19T15:00:00-07:00',
      }
    ],
    reactions: {
      kawaii: { emoji: '🌸', count: 3, label: 'Kawaii', userIds: [] },
      hype: { emoji: '🔥', count: 21, label: 'Hype', userIds: ['current_user_kaimosi', 'user_wanjiku', 'user_mwaniki'] },
      shocked: { emoji: '⚡', count: 9, label: 'Shocked', userIds: ['user_wanjiku'] },
      feels: { emoji: '😭', count: 1, label: 'Feels', userIds: [] }
    }
  },
  {
    id: 'post_3',
    userId: 'user_mwaniki',
    content: 'The psychological depth of Seinen manga really is unmatched. I’ve been analyzing the panels of Vagabond. Inoue’s brushwork is pure art. Anyone in Western Kenya down for a Manga Study Group where we review artwork and draw together? We can host it bi-weekly.',
    createdAt: '2026-06-18T10:15:00-07:00',
    likesCount: 12,
    isLikedByUser: false,
    comments: [],
    reactions: {
      kawaii: { emoji: '🌸', count: 1, label: 'Kawaii', userIds: [] },
      hype: { emoji: '🔥', count: 6, label: 'Hype', userIds: ['user_kiprop'] },
      shocked: { emoji: '⚡', count: 14, label: 'Shocked', userIds: ['user_wanjiku'] },
      feels: { emoji: '😭', count: 0, label: 'Feels', userIds: [] }
    }
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'group_1',
    name: 'Kaimosi Friends Univ Anime Club',
    description: 'The official anime and manga hub for Kaimosi Friends University College students and local fans in Kaimosi. We organize weekly watch parties, debate lore, and host gaming nights.',
    location: 'Kaimosi, Kenya',
    memberCount: 86,
    createdBy: 'user_wanjiku',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80',
    joined: true,
  },
  {
    id: 'group_2',
    name: 'Western Kenya Manga Artists',
    description: 'A community for manga illustrators, sketchers, and enthusiasts across Kaimosi, Chavakali, Vihiga, and Kisumu. Share your ink work, get feedback, and collaborate on local webcomics!',
    location: 'Western Province, Kenya',
    memberCount: 34,
    createdBy: 'user_mwaniki',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80',
    joined: false,
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event_1',
    groupId: 'group_1',
    title: 'Chrono-Trigger Finale Screening',
    description: 'Get ready for the epic finale of Kaimosi Chrono-Trigger! We will have a pre-show trivia game with small gifts, watch the final 3 episodes on a projector, and then enjoy late-night chai/soda. Welcoming all wasee! Meet us inside Kiprop Gaming Café near the main campus root.',
    location: 'Kiprop Anime Cafe, Kaimosi',
    startTime: '2026-06-26T18:00:00-07:00',
    rsvpCount: 22,
    userRsvp: 'going',
  },
  {
    id: 'event_2',
    groupId: 'group_2',
    title: 'Bi-weekly Outdoor Jam Session',
    description: 'Pack your sketchbooks, drawing pens, and watercolor kits. We are meeting under the shady acacia trees behind KB Campus to sketch local Kenyan scenarios in distinct manga art styles. No experience required, master artists will guide beginners!',
    location: 'University Gardens, Kaimosi Friends Univ',
    startTime: '2026-07-04T10:00:00-07:00',
    rsvpCount: 8,
    userRsvp: null,
  }
];

export const DEFAULT_WATCHLIST = [
  {
    id: 'wl_1',
    userId: 'current_user_kaimosi',
    animeId: 'anime_2', // Time-shift
    status: 'watching' as const,
    progress: 8,
    maxEpisodes: 12,
    rating: 9,
    updatedAt: '2026-06-20T08:00:00-07:00',
  },
  {
    id: 'wl_2',
    userId: 'current_user_kaimosi',
    animeId: 'anime_1', // Ningendao
    status: 'completed' as const,
    progress: 24,
    maxEpisodes: 24,
    rating: 10,
    updatedAt: '2026-06-15T18:00:00-07:00',
  },
  {
    id: 'wl_3',
    userId: 'current_user_kaimosi',
    animeId: 'anime_3', // Spirit bound
    status: 'plan_to_watch' as const,
    progress: 0,
    maxEpisodes: 26,
    updatedAt: '2026-06-19T22:00:00-07:00',
  }
];

export const MOCK_MESSAGES: Message[] = [
  // Group 1 messages
  {
    id: 'msg_1',
    senderId: 'user_wanjiku',
    groupId: 'group_1',
    content: 'Wasee! Are we meeting at the cafe as usual this Friday?',
    createdAt: '2026-06-20T07:15:00-07:00',
  },
  {
    id: 'msg_2',
    senderId: 'user_kiprop',
    groupId: 'group_1',
    content: 'Absolute! Chai, tea, and high-frequency mecha fights are prepared.',
    createdAt: '2026-06-20T07:30:00-07:00',
  },
  {
    id: 'msg_3',
    senderId: 'current_user_kaimosi',
    groupId: 'group_1',
    content: 'Hype! I will make sure to finish earlier with assignments and head over. See you guys then!',
    createdAt: '2026-06-20T07:45:00-07:00',
  },
  // 1-on-1 messages with Mary (user_wanjiku)
  {
    id: 'msg_4',
    senderId: 'user_wanjiku',
    receiverId: 'current_user_kaimosi',
    content: 'Amadi! Did you check out the cover artwork draft I posted on the feed?',
    createdAt: '2026-06-20T08:35:00-07:00',
  },
  {
    id: 'msg_5',
    senderId: 'current_user_kaimosi',
    receiverId: 'user_wanjiku',
    content: 'Yes! Just saw it and dropped a comment. This and the Ghibli sketches are incredible Mary!',
    createdAt: '2026-06-20T08:47:00-07:00',
  },
  {
    id: 'msg_6',
    senderId: 'user_wanjiku',
    receiverId: 'current_user_kaimosi',
    content: 'Shukran! Trying my best. Appreciate the feedback!',
    createdAt: '2026-06-20T08:50:00-07:00',
  }
];
