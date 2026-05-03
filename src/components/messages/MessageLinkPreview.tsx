"use client";

import { useState, useEffect } from "react";
import { Spin, ConfigProvider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import { tracksService } from "@/services/tracks.service";
import { playlistsService } from "@/services/playlists.service";
import type { Track } from "@/types/tracks.types";
import type { PlaylistDetail } from "@/types/playlists.types";

// ─── URL parsing ──────────────────────────────────────────────────────────────
// Playlist must be checked BEFORE track because it has an extra /sets/ segment.
// Track:    https://beatza.me/{profileLink}/{permalink}
// Playlist: https://beatza.me/{profileLink}/sets/{permalink}

const BEATZA_PLAYLIST_RE = /^https:\/\/beatza\.me\/([^/]+)\/sets\/([^/]+)$/;
const BEATZA_TRACK_RE = /^https:\/\/beatza\.me\/([^/]+)\/([^/]+)$/;

type ParsedLink =
  | { type: "track"; profileLink: string; permalink: string }
  | { type: "playlist"; profileLink: string; permalink: string }
  | null;

function parseBeatza(url: string): ParsedLink {
  const playlistMatch = url.match(BEATZA_PLAYLIST_RE);
  if (playlistMatch)
    return { type: "playlist", profileLink: playlistMatch[1], permalink: playlistMatch[2] };

  const trackMatch = url.match(BEATZA_TRACK_RE);
  if (trackMatch) return { type: "track", profileLink: trackMatch[1], permalink: trackMatch[2] };

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MessageLinkPreviewProps {
  url: string;
}

type PreviewState =
  | { status: "loading" }
  | { status: "track"; data: Track }
  | { status: "playlist"; data: PlaylistDetail; artistName: string }
  | { status: "error" };

export default function MessageLinkPreview({ url }: MessageLinkPreviewProps) {
  const [state, setState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    const parsed = parseBeatza(url);
    if (!parsed) {
      setState({ status: "error" });
      return;
    }

    let cancelled = false;

    const load = async () => {
      setState({ status: "loading" });
      try {
        if (parsed.type === "track") {
          const res = await tracksService.getPublicTrackByPermalink(
            parsed.profileLink,
            parsed.permalink
          );
          if (!cancelled) setState({ status: "track", data: res.data.data });
        } else {
          const res = await playlistsService.getPlaylistByProfileAndPermalink(
            parsed.profileLink,
            parsed.permalink
          );
          const playlist = res.data.data.playlist;
          // Artist name — use first track's poster displayName, fall back to artistId
          const artistName = playlist.tracks?.[0]?.poster?.displayName ?? playlist.artistId;
          if (!cancelled) setState({ status: "playlist", data: playlist, artistName });
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Fallback — show as a plain link (same as MessageBubble already does for non-beatza links)
  if (state.status === "error") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-400 hover:underline break-all"
      >
        {url}
      </a>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 py-2">
        <ConfigProvider theme={{ token: { colorPrimary: "var(--fg)" } }}>
          <Spin indicator={<LoadingOutlined spin style={{ color: "var(--fg)" }} />} size="small" />
        </ConfigProvider>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-400 hover:underline break-all"
        >
          {url}
        </a>
      </div>
    );
  }

  if (state.status === "track") {
    const track = state.data;
    return (
      <PopoverProvider>
        <div className="mt-2">
          <WaveformCard
            img={track.image?.imgLink}
            title={track.basicInfo?.title}
            artist={track.basicInfo?.mainArtists?.[0]}
            artistId={track.posterId}
            trackId={track.trackId ?? ""}
            trackUrl={track.audio?.audioLink}
            wfLink={track.audio?.waveformLink}
            duration={track.durationInSeconds}
            tag={track.basicInfo?.tags?.[0]}
            audioClipStart={track.audioClip?.start}
            audioClipEnd={track.audioClip?.end}
            likeCount={track.numLikes}
            repostCount={track.numReposts}
            playsCount={track.numPlays}
            commentsCount={track.numComments}
            isLikedByUser={track.isLikedByUser}
            isRepostedByUser={track.isRepostedByUser}
            enableDirectDownload={track.permissions?.enableDirectDownload ?? false}
            allTracks={[]}
          />
        </div>
      </PopoverProvider>
    );
  }

  // state.status === 'playlist'
  const playlist = state.data;
  return (
    <div className="mt-2">
      <PlaylistWaveformCard
        img={playlist.image?.imgLink}
        title={playlist.title}
        artist={state.artistName}
        artistId={playlist.artistId}
        playlistId={playlist._id}
        tag={playlist.genre}
        likeCount={playlist.numOfLikes}
        repostCount={playlist.numOfReposts}
        isLikedByUser={playlist.isLiked}
        isRepostedByUser={playlist.isReposted}
        preloadedTracks={playlist.tracks}
        totalTracks={playlist.totalTracks}
        feedQueue={[]}
      />
    </div>
  );
}
