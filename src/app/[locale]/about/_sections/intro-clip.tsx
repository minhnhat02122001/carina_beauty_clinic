"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function IntroClip({
  videoId,
  thumbnailUrl,
  playLabel,
}: {
  videoId: string;
  thumbnailUrl: string | null;
  playLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlayerMounted, setIsPlayerMounted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // An idle visit still pays nothing: the player is only fetched once the clip
  // comes near the viewport, which is well before anyone can tap it.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsPlayerMounted(true);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlayerMounted) return;

    let isAcknowledged = false;

    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes("youtube")) return;
      // Any reply at all means the player is now reporting to us.
      isAcknowledged = true;
      let payload: { event?: string; info?: number | { playerState?: number } };
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }
      // The widget protocol reports state on infoDelivery.info.playerState.
      // onStateChange, with info as a bare number, only arrives through the
      // official API wrapper — listening for that alone never fires here.
      const state =
        payload.event === "infoDelivery" && typeof payload.info === "object"
          ? payload.info?.playerState
          : payload.event === "onStateChange" && typeof payload.info === "number"
            ? payload.info
            : undefined;

      // 1 playing, 3 buffering — either means the tap reached the player.
      if (state === 1 || state === 3) setHasStarted(true);
    }

    // The player silently drops a handshake that arrives before its own script
    // has run, and a warm cache makes that the normal case: the iframe's load
    // event beats the player, the one handshake is lost, and the poster then
    // sits over a video that is already playing. So keep asking until it
    // answers — which is immediately, once it is listening.
    const handshake = setInterval(() => {
      if (isAcknowledged) {
        clearInterval(handshake);
        return;
      }
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: videoId, channel: "widget" }),
        "*",
      );
    }, 300);
    const giveUp = setTimeout(() => clearInterval(handshake), 20000);

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(handshake);
      clearTimeout(giveUp);
    };
  }, [isPlayerMounted, videoId]);

  return (
    <div
      ref={containerRef}
      className="group relative mx-auto aspect-[9/16] w-2/3 max-w-[280px] overflow-hidden rounded-2xl bg-[var(--color-background-alt)] sm:max-w-[320px] lg:w-full lg:max-w-[420px]"
    >
      {isPlayerMounted && (
        <iframe
          ref={iframeRef}
          // No autoplay to ask for: iOS Safari refuses audible playback that a
          // gesture outside the frame asked for, so the tap has to reach YouTube
          // itself. enablejsapi is what lets the player report that it did.
          src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&enablejsapi=1`}
          title={playLabel}
          // `fullscreen` has to be in the allow list, not just the allowFullScreen
          // attribute: once an explicit allow list is present Safari builds the
          // permission from it alone and drops the legacy attribute, so the player
          // sees fullscreen as denied and hides its fullscreen button.
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      )}

      {/* Inert on purpose. This used to be a button that swapped in an autoplaying
          embed, which cost a second tap on iPhone — the first one only built the
          player and iOS then refused to start it. Letting the tap fall straight
          through to YouTube makes one tap enough, and keeps the editor's own
          thumbnail rather than YouTube's. */}
      {!hasStarted && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 block">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 320px, 66vw"
            />
          )}
          <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(2,11,39,0.4)] transition-transform duration-300 group-hover:scale-110 lg:size-16">
            <span className="relative size-6 lg:size-8">
              <Image src="/images/featured-events/icon-play.svg" alt="" fill className="object-contain" sizes="32px" />
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
