import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ScrollStory
 *
 * One pinned stage. As you scroll, each scene's clip crossfades in and its copy
 * comes with it. Only the active clip is mounted and playing; every other scene
 * shows its poster still, so the page never runs 13 video decoders at once.
 *
 * Drop clips into /public/film as <id>.mp4 and <id>.webm. Until a clip exists the
 * scene simply shows its poster, so the whole rig is usable before any video lands.
 */

type Scene = {
  id: string;
  tag: string;
  head: string;
  ital?: string;   // blue italic tail, matching the Overland display treatment
  body: string;
  align?: 'left' | 'center';
  /** Flip to true once /public/film/<id>.mp4 exists. Until then the scene renders
   *  its poster still, and no bogus video request is made. */
  hasClip?: boolean;
  /** Background behind the plate, sampled from this clip's own backdrop corner. The
   *  stage paints it so a letterboxed plate has no visible seam. Generations vary
   *  batch to batch, so one shared colour cannot cover all of them. */
  ground: string;
  /** object-position for this scene's crop. `cover` fills the frame, so on a wide
   *  viewport it trims top and bottom - shift the window when the subject would
   *  otherwise be clipped or collide with the copy. Defaults to centre. */
  focus?: string;
};

const SCENES: Scene[] = [
  {
    id: '01-box',
    ground: '#BFBFBF',
    hasClip: true,
    tag: 'Open board',
    head: 'An open board for',
    ital: 'US freight.',
    body: 'Post a load or post a truck. Anyone can bid, everyone sees the rate. No membership, no gate, no cut.',
    align: 'center',
  },
  {
    id: '02-warehouse',
    ground: '#EBE7E8',
    hasClip: true,
    tag: '01 · Post',
    head: 'Post what',
    ital: 'you have.',
    body: 'One pallet or a full trailer. An empty return leg. Confirm your email and it is live on the board in seconds.',
  },
  {
    id: '03-crossdock',
    ital: 'both ways.',
    ground: '#D4D2D1',
    hasClip: true,
    tag: '02 · Bid',
    head: 'Anyone can bid,',
    body: 'Shippers bid on trucks. Truckers bid on freight. Individuals and companies sit on the same board.',
  },
  {
    id: '04-coldchain',
    ital: 'public.',
    ground: '#E3DEDF',
    hasClip: true,
    tag: '03 · Open',
    head: 'Every bid is',
    body: 'You see what everyone else offered, not just the number one person chose to tell you.',
  },
  {
    id: '05-corridor',
    ital: 'or partials.',
    ground: '#E3E0DA',
    hasClip: true,
    focus: 'center 32%',
    tag: 'Lanes',
    head: 'Full loads and',
    body: 'Take a whole trailer, or share the space with freight going the same way and split the cost.',
  },
  {
    id: '06-rail',
    ital: 'actually pays.',
    ground: '#E7E5E5',
    hasClip: true,
    tag: 'Rates',
    head: 'What the lane',
    body: 'Live rate per mile and a thirty-day average on every lane. Free to look at, before you post anything.',
  },
  {
    id: '07-port',
    ital: 'freight.',
    ground: '#ECE9EA',
    hasClip: true,
    tag: 'Reach',
    head: 'Every kind of',
    body: 'Dry van, reefer, flatbed. Local runs and coast to coast. If a truck can carry it, it belongs here.',
  },
  {
    id: '08-air',
    ital: 'phone calls.',
    ground: '#E6E4E5',
    hasClip: true,
    tag: 'Speed',
    head: 'Minutes, not',
    body: 'A load and a truck stop sitting two calls apart. Post it, watch the bids land, take the one you want.',
  },
  {
    id: '09-customs',
    ground: '#EAE7E8',
    hasClip: true,
    tag: 'Trust',
    head: 'We check the email.',
    ital: 'You check the rest.',
    body: 'MC and USDOT numbers are shown as entered, unverified, so you can look them up yourself on the FMCSA register.',
  },
  {
    id: '10-lastmile',
    ital: 'people shipping.',
    ground: '#DFDFDF',
    hasClip: true,
    tag: 'Who',
    head: 'Truckers and the',
    body: 'No brokers in the middle taking a slice. An owner-operator and a business, dealing with each other directly.',
  },
  {
    id: '12-exception',
    ground: '#E3E0DF',
    hasClip: true,
    tag: '04 · Connect',
    head: 'Agree, and we',
    ital: 'introduce you.',
    body: 'Name, email and phone, sent to both sides at once. Nothing is shared before you both accept.',
  },
  {
    id: '13-orchestrator',
    ground: '#D4D4D4',
    hasClip: true,
    tag: '05 · Done',
    head: 'Your deal,',
    ital: 'your terms.',
    body: 'Rate confirmation, insurance, paperwork, payment. All yours. We take no cut and never touch the money.',
    align: 'center',
  },
];

/** How much scroll each scene gets. Higher = slower story.
 *  Phones get less: 12 x 180vh of thumb-scrolling is punishing on a small screen. */
const VH_PER_SCENE = 180;
const VH_PER_SCENE_MOBILE = 115;

/**
 * One scene in the unpinned (phone) telling.
 *
 * The clip plays at its own rate rather than being scrubbed. Scrubbing forces a decode
 * on every scroll frame, which is what made this unwatchable on a phone; ordinary
 * playback is the thing video hardware is actually built for. Nothing loads until the
 * scene is close to the viewport and it pauses again on the way out, so a visitor who
 * stops halfway down has not paid for the clips below.
 */
function StackedScene({ s, reduced }: { s: Scene; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  /* Attach the source only when the scene is approached. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !s.hasClip || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSrc(`/film/${s.id}-m.mp4`);
        else el.pause();
      },
      { rootMargin: '250px 0px', threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [s.id, s.hasClip, reduced]);

  /* Setting src is not enough on its own: a <video> that has already been created
     will not fetch a newly-attached source until load() is called, and mobile Safari
     is strict about it where Chromium quietly recovers. Then play() - which returns a
     promise that rejects rather than throws when autoplay is refused. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    el.load();
    const start = () => el.play().catch(() => {
      /* Autoplay refused - low power mode, or a data saver. The poster still carries
         the frame, and the first touch anywhere gets it going. */
      const once = () => { el.play().catch(() => {}); document.removeEventListener('touchstart', once); };
      document.addEventListener('touchstart', once, { once: true, passive: true });
    });
    if (el.readyState >= 2) start();
    else el.addEventListener('loadeddata', start, { once: true });
  }, [src]);

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-10 sm:py-16 lg:px-8">
      {s.hasClip && !reduced ? (
        <video
          ref={ref}
          /* An explicit aspect ratio matters more than it looks: with preload="none"
             and no src yet, the element has no intrinsic size and can collapse to a
             zero-height box - which never intersects, so the observer never fires and
             the clip never loads. Pinning the ratio gives it a real box from the
             first paint and keeps the poster the right size. */
          className="aspect-[16/9] w-full rounded-[9px] border border-[rgba(17,17,17,0.08)] object-cover"
          poster={`/film/${s.id}.jpg`}
          /* muted + playsInline are the two conditions every mobile browser requires
             before it will autoplay anything at all. */
          muted
          loop
          playsInline
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ 'webkit-playsinline': 'true' } as any)}
          preload="none"
          aria-hidden
          /* The -m encode only. A phone has no use for the desktop file. */
          src={src ?? undefined}
        />
      ) : (
        <img
          src={`/film/${s.id}.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full rounded-[9px] border border-[rgba(17,17,17,0.08)]"
        />
      )}
      <div className="mt-6 max-w-[34rem] sm:mt-8">
        <span className="aon-eyebrow">{s.tag}</span>
        <h2 className="aon-display mt-4 text-[clamp(28px,3.4vw,44px)]">
          {s.head}{s.ital && <> {s.ital}</>}
        </h2>
        <p className="aon-body mt-4 text-[15px] leading-[1.7]">{s.body}</p>
      </div>
    </div>
  );
}

export default function ScrollStory() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    const mob = window.matchMedia('(max-width: 767px)');
    const applyMob = () => setIsMobile(mob.matches);
    applyMob();
    mob.addEventListener('change', applyMob);
    return () => {
      mq.removeEventListener('change', apply);
      mob.removeEventListener('change', applyMob);
    };
  }, []);

  /* Scroll -> a single float position through the whole story, then EASED.
   *
   * Locking the playhead 1:1 to scrollTop is what makes a scrubbed clip read as
   * "a video being dragged": it inherits every wheel notch and trackpad jitter.
   * Instead scroll sets a target and the rendered position chases it with a spring,
   * so the picture glides and settles. That single change is most of what makes it
   * feel animated rather than scrubbed.
   */
  const target = useRef(0);         // where scroll says we are
  const eased = useRef(0);          // where we are actually drawing
  const raf = useRef(0);
  const [pos, setPos] = useState(0);

  const readScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    /* Not window.innerHeight. On a phone that value changes as the address bar
       collapses, so the denominator moved mid-scroll and the playhead jumped - the
       glitch. The pinned stage is a fixed 100svh, so measuring it gives a number that
       holds still while the reader is actually scrolling. */
    const stageH = stageRef.current?.offsetHeight ?? window.innerHeight;
    const total = rect.height - stageH;
    if (total <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / total));
    target.current = p * SCENES.length;
  }, []);

  /* Two modes.
   *
   *  scrubbing - the reader is moving, so the playhead follows scroll exactly.
   *  playing   - the section is on screen and nothing has moved for a beat, so the
   *              clip just plays and loops on its own.
   *
   * Actually playing beats scrubbing the playhead forward: it is one decode instead
   * of a seek per frame, and it is what "a running video" means.
   */
  const inView = useRef(false);
  const idleTimer = useRef<number>();
  const [playing, setPlaying] = useState(false);

  const tick = useCallback(() => {
    const d = target.current - eased.current;
    // Critically damped enough to never overshoot, loose enough to feel like motion.
    eased.current += d * 0.12;
    setPos(eased.current);
    // Keep running while still travelling; park when settled so an idle page is free.
    raf.current = Math.abs(d) > 0.0004 ? requestAnimationFrame(tick) : 0;
  }, []);

  const wake = useCallback(() => {
    setPlaying(false);
    window.clearTimeout(idleTimer.current);
    if (inView.current) {
      idleTimer.current = window.setTimeout(() => setPlaying(true), 900);
    }
    readScroll();
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [readScroll, tick]);

  useEffect(() => {
    if (reduced) return;
    const onVisible = () => { if (!document.hidden) wake(); };

    // Pause the drift whenever the film is off screen, so it never runs unseen.
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting) wake();
        else { window.clearTimeout(idleTimer.current); setPlaying(false); }
      },
      { threshold: 0.25 },
    );
    if (wrapRef.current) io.observe(wrapRef.current);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake, { passive: true });
    document.addEventListener('visibilitychange', onVisible);
    readScroll();
    eased.current = target.current;   // no slide-in on first paint
    setPos(eased.current);
    return () => {
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      document.removeEventListener('visibilitychange', onVisible);
      io.disconnect();
      window.clearTimeout(idleTimer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [wake, readScroll, reduced]);

  const active = Math.min(SCENES.length - 1, Math.floor(pos));
  const progress = Math.min(1, Math.max(0, pos - active));

  /* The next clip is preloaded by giving its <video> preload="auto" once it is near -
     see isNear below. There used to be a <link rel="prefetch" as="video"> here as well,
     which fetched the same file a second time under different cache semantics: the
     largest clip was pulled twice, 2MB each. It also hardcoded the desktop .mp4, so a
     phone downloaded a file it would never play and then fetched the -m variant on top.
     The video element already picks the right source and preloads it. */

  /* Scroll scrubbing: clips never play on their own. The active clip's playhead is
     driven directly by scroll position, so the animation only moves when the reader
     moves. Everything else is parked at frame zero.
     Requires keyframe-dense encodes or seeking stutters - see FILM.md. */
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.pause();
      if (i !== active && v.currentTime > 0.05) {
        try { v.currentTime = 0; } catch { /* not seekable yet */ }
      }
    });
  }, [active]);

  /* Play the active clip while idle; hand control back to the scrubber on scroll. */
  useEffect(() => {
    const v = videoRefs.current[active];
    if (!v) return;
    if (playing) {
      v.loop = true;
      const pr = v.play();
      if (pr && typeof pr.catch === 'function') pr.catch(() => {});
    } else {
      v.pause();
    }
  }, [playing, active]);

  useEffect(() => {
    if (playing) return;            // scrubbing would fight playback
    const v = videoRefs.current[active];
    if (!v) return;
    const d = v.duration;
    if (!d || !isFinite(d)) return;          // metadata not in yet
    const t = Math.min(d - 0.02, Math.max(0, progress * d));
    if (Math.abs(v.currentTime - t) > 0.015) {
      try { v.currentTime = t; } catch { /* seek raced a reload */ }
    }
  }, [active, progress, playing]);

  /* Phones and reduced-motion both get the unpinned version: no sticky, no viewport
     units, no scrubbed video, so none of the pinned layout's failure modes exist.
     
     What goes is the pinning and the scrubbing, not the film. A pinned stage on a
     phone has to agree with a viewport that resizes underneath it every time the
     address bar moves, and scrubbing forces a decode on every scroll frame - on the
     slowest hardware in the chain. Three passes at reconciling svh/lvh did not settle
     it. Here the clips simply play, in view, one at a time. */
  if (reduced || isMobile) {
    return (
      <section className="bg-[#FAF9F7]" aria-label="How Overland works">
        {SCENES.map((s) => (
          <StackedScene key={s.id} s={s} reduced={reduced} />
        ))}
      </section>
    );
  }

  /* The track's height lives in CSS (.ov-story-track) rather than inline so it can
     carry a vh fallback: an unsupported unit in an inline style collapses the section
     instead of degrading. It must be svh because the pinned stage is 100svh - sizing
     the track against the address-bar-hidden viewport while the pin uses the
     address-bar-shown one is what released the pin early and left a white gap. */
  return (
    <section
      ref={wrapRef}
      aria-label="How Overland works"
      className="ov-story-track relative bg-[#FAF9F7]"
      style={{ '--ov-track': SCENES.length * (isMobile ? VH_PER_SCENE_MOBILE : VH_PER_SCENE) } as React.CSSProperties}
    >
      <div
        ref={stageRef}
        className="ov-story-stage sticky top-0 w-full overflow-hidden"
        style={{
          perspective: '1600px',
          perspectiveOrigin: '50% 45%',
          background: SCENES[active].ground,
          transition: 'background-color 420ms linear',
        }}
      >
        {SCENES.map((s, i) => {
          // Crossfade window: fade in over the first 18% of a scene, out over the last 18%.
          const d = i - active;
          let opacity = 0;
          if (d === 0) opacity = 1;
          else if (d === 1) opacity = Math.max(0, (progress - 0.82) / 0.18);
          else if (d === -1) opacity = 0; // outgoing handled by the incoming layer sitting on top

          const isNear = Math.abs(d) <= 1;
          // Base 1.08 so the plate fills the frame, plus a slow drift across the scene.
              // Held at 1.0 base: any scale above native resamples and softens. The
              // depth instead comes from translateZ + a slow vertical drift, which the
              // stage's `perspective` turns into an actual recede rather than a zoom.
              const scale = 1 + (d === 0 ? progress * 0.03 : 0);
              const depthZ = d === 0 ? -40 * progress : 0;     // px, recedes as it plays
              const driftY = d === 0 ? -1.6 * progress : 0;    // %, slow lift

          return (
            <div
              key={s.id}
              className="absolute inset-0"
              style={{ opacity, zIndex: 10 + (d === 1 ? 1 : 0), transition: 'opacity 120ms linear' }}
              aria-hidden={d !== 0}
            >
              {/* Clip. Poster carries the frame until the video is decoded, and
                  stands in permanently if no clip has been added yet. */}
              {s.hasClip ? (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  className="aon-plate absolute inset-0 h-full w-full"
                  style={{ transform: `translate3d(0, ${driftY}%, ${depthZ}px) scale(${scale})`, transformOrigin: 'center', objectPosition: s.focus ?? 'center' }}
                  /* Only near scenes get a poster. The attribute is fetched eagerly and
                     ignores lazy-loading, so setting it on all twelve pulled ~700KB of
                     JPEGs for scenes that were nowhere near the viewport. */
                  poster={isNear ? `/film/${s.id}.jpg` : undefined}
                  muted
                  playsInline
                  /* none, not metadata: metadata still opens a connection per clip and
                     pulls headers for all twelve on first paint. A far scene needs
                     nothing until it becomes near, at which point this flips to auto. */
                  preload={isNear ? 'auto' : 'none'}
                >
                  <source media="(max-width: 767px)" src={`/film/${s.id}-m.mp4`} type="video/mp4" />
                  <source src={`/film/${s.id}.mp4`} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={`/film/${s.id}.jpg`}
                  alt=""
                  className="aon-plate absolute inset-0 h-full w-full"
                  style={{ transform: `translate3d(0, ${driftY}%, ${depthZ}px) scale(${scale})`, transformOrigin: 'center', objectPosition: s.focus ?? 'center' }}
                  loading={isNear ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )}

              {/* Legibility scrim, weighted to wherever the copy sits. */}
              <div
                className="absolute inset-0"
                style={{
                  background: isMobile
                    ? 'linear-gradient(180deg, rgba(250,249,247,0) 34%, rgba(250,249,247,.72) 62%, rgba(250,249,247,.95) 100%)'
                    : s.align === 'center'
                      ? 'radial-gradient(ellipse at center, rgba(250,249,247,.80) 0%, rgba(250,249,247,.34) 45%, rgba(250,249,247,0) 70%)'
                      : 'linear-gradient(90deg, rgba(250,249,247,.92) 0%, rgba(250,249,247,.70) 26%, rgba(250,249,247,.28) 46%, rgba(250,249,247,0) 66%)',
                }}
              />

              {/* Depth vignette. Very light - it reads as lens falloff, and stops the
                  plate looking like a flat rectangle pasted over the page. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(120% 90% at 50% 42%, rgba(17,17,17,0) 42%, rgba(17,17,17,.05) 74%, rgba(17,17,17,.11) 100%)',
                }}
              />

              {/* Copy */}
              <div className="absolute inset-0 mx-auto flex max-w-[1240px] items-end px-6 pb-12 md:items-center md:pb-0 lg:px-8">
                <div
                  className={
                    s.align === 'center'
                      ? 'mx-auto max-w-[40rem] text-center'
                      : 'max-w-[32rem]'
                  }
                  /* Opacity is deliberately left at 1: the whole layer already
                     crossfades, and fading the copy on top of that double-dips and
                     leaves scene one blank at scroll-top. Only a slow parallax drift. */
                  style={{
                    // Copy travels further and opposite to the plate's drift; that
                    // differential is what makes the text sit in front of the scene
                    // rather than on top of it.
                    transform: `translate3d(0, ${18 - progress * 40}px, 60px)`,
                  }}
                >
                  <span className="aon-eyebrow">{s.tag}</span>
                  <h2 className="aon-display mt-4 text-[clamp(34px,4.8vw,63px)]">
                    {s.head}
                    {s.ital && <> {s.ital}</>}
                  </h2>
                  {i === 0 && (
                    <div className={`mt-7 flex flex-wrap items-center gap-3 ${
                      s.align === 'center' ? 'justify-center' : ''
                    }`}>
                      <a href="#book" className="aon-cta aon-cta--dark">Open the board</a>
                      <a href="#how" className="aon-cta aon-cta--ghost">How it works</a>
                    </div>
                  )}
                  <p
                    className={`aon-body mt-5 text-[15px] leading-[1.7] ${
                      s.align === 'center' ? 'mx-auto max-w-[30rem]' : 'max-w-[29rem]'
                    }`}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}


        {/* Progress hairline */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-[2px] bg-[rgba(17,17,17,0.08)]">
          <div
            className="h-full bg-[#1E4D6B]"
            style={{ width: `${((active + progress) / SCENES.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
