
import { Mood, Song } from "../contexts/AppContext";

const JAMENDO_CLIENT_ID = "76d25516";
const JAMENDO_API_URL = "https://api.jamendo.com/v3.0";

type JamendoTrack = {
  id: string;
  name: string;
  artist_name: string;
  album_image: string;
  duration: number;
  audio: string;
};

export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const response = await fetch(
      `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((track: JamendoTrack) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      albumArt: track.album_image,
      duration: track.duration,
      url: track.audio,
    }));
  } catch (error) {
    console.error("Error searching songs:", error);
    return [];
  }
}

export async function getSongsByMood(mood: Mood): Promise<Song[]> {
  // Map our app's mood to tags that Jamendo might understand
  const moodTagMap: Record<Mood, string> = {
    happy: "happy",
    sad: "sad,melancholic",
    relaxed: "relaxing,calm",
    energetic: "energetic,upbeat",
    romantic: "romantic,love",
    angry: "angry,intense",
    chill: "chill,ambient",
    focused: "focused,concentration",
    excited: "exciting,uplifting",
    sleepy: "sleep,lullaby",
    motivated: "motivational,inspiring"
  };

  try {
    const tags = moodTagMap[mood] || mood;
    const response = await fetch(
      `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&tags=${tags}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((track: JamendoTrack) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      albumArt: track.album_image,
      duration: track.duration,
      url: track.audio,
      mood: mood
    }));
  } catch (error) {
    console.error(`Error getting songs for mood ${mood}:`, error);
    return [];
  }
}

export async function getLyrics(artist: string, title: string): Promise<string | null> {
  try {
    // Using Lyrics.ovh API
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.lyrics;
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return null;
  }
}

// Fallback data in case API doesn't work during development
export const getFallbackSongs = (mood: Mood): Song[] => {
  const baseSongs: Song[] = [
    {
      id: "1",
      title: "Summer Memories",
      artist: "Ocean Waves",
      albumArt: "https://picsum.photos/id/1019/300",
      duration: 213,
      mood: "happy"
    },
    {
      id: "2",
      title: "Rainy Days",
      artist: "City Lights",
      albumArt: "https://picsum.photos/id/1039/300",
      duration: 187,
      mood: "sad"
    },
    {
      id: "3",
      title: "Mountain Sunrise",
      artist: "Nature Sounds",
      albumArt: "https://picsum.photos/id/1018/300",
      duration: 245,
      mood: "relaxed"
    },
    {
      id: "4",
      title: "City Rhythm",
      artist: "Urban Beats",
      albumArt: "https://picsum.photos/id/1071/300",
      duration: 198,
      mood: "energetic"
    },
    {
      id: "5",
      title: "Sunset Love",
      artist: "Evening Sky",
      albumArt: "https://picsum.photos/id/1082/300",
      duration: 222,
      mood: "romantic"
    }
  ];
  
  return baseSongs.filter(song => song.mood === mood);
};
