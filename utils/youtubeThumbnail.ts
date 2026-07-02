import { getYoutubeEmbedUrl } from './youtubeEmbed';

export function getYoutubeVideoId(url: string): string {
  const embed = getYoutubeEmbedUrl(url);
  const match = embed.match(/\/embed\/([\w-]{11})/);
  return match?.[1] || '';
}

export function getYoutubeThumbnailUrl(url: string): string {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}
