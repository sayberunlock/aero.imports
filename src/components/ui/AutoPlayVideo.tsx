"use client";

import { useEffect, useRef } from "react";

type AutoPlayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Mostra os controles do player (o vídeo continua tocando sozinho, mudo). */
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
};

/**
 * Vídeo em loop, mudo, que começa a tocar sozinho — inclusive no celular.
 *
 * Como funciona (em linguagem simples):
 * - Celulares só deixam um vídeo tocar sozinho se ele for MUDO e estiver
 *   marcado para tocar "dentro da página" (playsInline). Aqui isso é
 *   garantido tanto no HTML quanto por código, antes de qualquer tentativa.
 * - O vídeo tenta tocar em vários momentos, porque um deles costuma dar
 *   certo mesmo quando os outros falham: assim que carrega, quando tem
 *   dados suficientes, quando a pessoa volta de outra aba e quando ele
 *   aparece na tela.
 * - Só toca enquanto está visível: sai da tela, pausa. Isso poupa bateria
 *   e internet do cliente (importante com vários vídeos na mesma página).
 * - Último recurso: se o próprio celular bloquear (modo de economia de
 *   bateria/dados, por exemplo), o primeiro toque REAL do cliente na tela
 *   (touchend/click — os únicos que os celulares aceitam) libera o vídeo.
 */
export function AutoPlayVideo({
  src,
  poster,
  className,
  controls = false,
  preload = "metadata",
}: AutoPlayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Garante "mudo" e "dentro da página" de verdade, antes de tentar tocar.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    let visible = false;
    let pausedByUser = false; // só importa quando há controles na tela
    let pausedByUs = false;

    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let retries = 0;

    const tryPlay = () => {
      if (!visible || pausedByUser) return;
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        // Bloqueado pelo celular (comum no iPhone logo no primeiro instante):
        // tenta de novo algumas vezes. Se ainda assim não liberar, o poster
        // continua na tela e o toque do cliente libera depois.
        promise.catch(() => {
          if (retries >= 4) return;
          retries += 1;
          clearTimeout(retryTimer);
          retryTimer = setTimeout(() => {
            if (visible && video.paused) tryPlay();
          }, 400 * retries);
        });
      }
    };

    const onPause = () => {
      if (controls && !pausedByUs && visible && document.visibilityState === "visible") {
        pausedByUser = true;
      }
      pausedByUs = false;
    };
    const onPlay = () => {
      pausedByUser = false;
      retries = 0;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible) {
          tryPlay();
        } else if (!video.paused) {
          pausedByUs = true;
          video.pause();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(video);

    const readyEvents = ["loadedmetadata", "loadeddata", "canplay", "suspend"] as const;
    readyEvents.forEach((name) => video.addEventListener(name, tryPlay));
    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", tryPlay);

    // Toque real do cliente = permissão garantida pelo celular.
    const gestureEvents = ["touchend", "pointerup", "click"] as const;
    const onGesture = () => tryPlay();
    const removeGestureListeners = () =>
      gestureEvents.forEach((name) => window.removeEventListener(name, onGesture));
    gestureEvents.forEach((name) =>
      window.addEventListener(name, onGesture, { passive: true }),
    );
    // Quando o vídeo de fato começa a tocar, não precisamos mais do "toque".
    video.addEventListener("playing", removeGestureListeners, { once: true });

    return () => {
      clearTimeout(retryTimer);
      observer.disconnect();
      readyEvents.forEach((name) => video.removeEventListener(name, tryPlay));
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("playing", removeGestureListeners);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", tryPlay);
      removeGestureListeners();
    };
  }, [src, controls]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      controls={controls}
      preload={preload}
    />
  );
}
