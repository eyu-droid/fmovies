export interface JellyfinServerConfig {
  baseUrl: string;
  itemId: string;
  userId?: string;
}

export function generateJellyfinPlayUrl(config: JellyfinServerConfig): string {
  const { baseUrl, itemId } = config;
  
  // Remove trailing slash if present
  const cleanUrl = baseUrl.replace(/\/$/, '');
  
  // Generate Jellyfin web player URL for the item
  return `${cleanUrl}/web/index.html#!/details?id=${itemId}`;
}

export function generateJellyfinSyncPlayUrl(
  config: JellyfinServerConfig,
  movieNightId?: string
): string {
  const { baseUrl, itemId } = config;
  
  // Remove trailing slash if present
  const cleanUrl = baseUrl.replace(/\/$/, '');
  
  // Generate URL for playing with SyncPlay enabled
  // Users will need to join the group in Jellyfin
  const playUrl = `${cleanUrl}/web/index.html#!/videoplayer?ids=${itemId}`;
  
  return playUrl;
}

export function formatJellyfinSyncPlayInstructions(
  title: string,
  movieTitle: string
): string {
  return `
🎬 **Watch together with Jellyfin SyncPlay**

📖 Steps:
1. Click "Open in Jellyfin" button
2. Wait for the video player to load
3. Look for the "SyncPlay" button in the player controls
4. Click it and create/join a group
5. Invite your friends to join the same group

✨ Once everyone is in the SyncPlay group:
- Your playback will stay synchronized
- Pausing for one pauses for everyone
- Seeking/skipping syncs across all users
- No buffering? Everyone waits together

💡 Tips:
- Make sure everyone has access to the Jellyfin server
- Test your connection before the movie starts
- You can chat in Telegram while watching
  `.trim();
}
