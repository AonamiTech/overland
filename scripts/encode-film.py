#!/usr/bin/env python3
"""
Standard encoder for the ScrollStory film clips.

One pass produces, for every scene:
  public/film/<id>.mp4   scroll-scrubbable video
  public/film/<id>.jpg   poster taken from that video's own first frame

Why these settings:
  -g 3 / -keyint_min 3 / -sc_threshold 0
      A keyframe every third frame (0.2s at 15fps). Scroll scrubbing seeks constantly; with a normal
      GOP the playhead lands between keyframes and the picture stalls or smears.
      This roughly triples file size and is the whole reason scrubbing feels solid.
  fps=15, scale=1920
      The playhead is driven by scroll, not by time, so frame rate reads as smooth
      regardless. 1920 is the source's native width - encoding smaller and letting
      object-fit upscale it to fill the viewport is what made clips look soft.
  h264 only, no VP9
      VP9 with a 2-frame GOP encoded LARGER than h264 here and seeks less reliably.

Tonal normalisation:
  Generations drift batch to batch - measured backdrops ranged 160 to 236 on a
  0-255 scale. Cut together that reads as the exposure jumping between shots. Each
  clip's backdrop corner is sampled and lifted to TARGET with a black-point raise
  (colorlevels), which preserves highlights; a plain brightness shift would blow the
  white plates out. Clips already at or above target are passed through ungraded.

Usage:
  python3 scripts/encode-film.py            # encode everything
  python3 scripts/encode-film.py 01-box     # encode just one scene
"""

import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(HERE)
OUT = os.path.join(PROJECT, "public", "film")
SRC_DIR = os.path.expanduser("~/Downloads")

# Backdrop luminance every clip is normalised toward (middle of the clean batch).
TARGET = 225
# Largest black-point raise allowed before contrast visibly suffers.
MAX_LIFT = 0.35
# Sampled from this corner box, which is empty background in every composition.
# Proportional, not a fixed pixel box: sources are 1920 wide and outputs 1100, so a
# fixed crop would measure a different region on each and report a bogus delta.
SAMPLE_CROP = "crop=iw/10:ih/10:iw/100:ih/100"
SAMPLE_AT = "1"  # seconds

VIDEO_ARGS = [
    "-an",
    "-c:v", "libx264",
    "-crf", "20",
    # g3 at 15fps is a keyframe every 0.2s - still dense enough that a scroll seek
    # lands within 3 frames of one, but roughly half the size of g2.
    "-g", "3", "-keyint_min", "3", "-sc_threshold", "0",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
]
# Native source width: encoding smaller then upscaling to fill the viewport was
# what made the clips look soft.
SCALE = "scale=1920:-2,fps=15"
# Mobile variant: a phone never shows more than ~430 CSS px of width, so 1920 is
# pure waste on cellular. 720p at crf26 lands ~4x smaller.
MOBILE_SCALE = "scale=720:-2,fps=15"
MOBILE_CRF = "26"
POSTER_SCALE = "scale=1600:-2"

# Per-scene trim: id -> (start_seconds, duration_seconds or None for "to the end").
# Generations run 8s and often have a dead head or tail - the model settling on the
# first frames, or the motion running out before the clip does. Trimming those means
# the scroll range maps onto the part that actually moves.
TRIM = {
    # Corridor is in REVERSE, so playback order is source-end -> source-start. That
    # inverts which end a trim touches: cutting the *played* tail means trimming the
    # source *head*. Source window 0.5s..6.5s, played back to front, drops 1.5s off
    # the played head (dead motion) and 0.5s off the played tail.
    "05-corridor": (0.5, 6.0),
}

# Scenes whose generation ran the motion backwards - the vehicles travel opposite to
# the way they face. Played in reverse they drive forward correctly.
REVERSE = {"05-corridor"}

# scene id -> source generation
SCENES = {
    "01-box":          "Animate_model_with_glowing_lights_202608281327.mp4",
    "02-warehouse":    "Robots_and_vehicles_moving_model_202608281257.mp4",
    "03-crossdock":    "Blue_trucks_driving_on_road_202608281321.mp4",
    "04-coldchain":    "Animate_scale_model_movement_1080p_202608281256.mp4",
    "05-corridor":     "Blue_trucks_driving_straight_road_202608281328.mp4",
    "06-rail":         "Scale_model_animation_instructions_1080p_202608281250.mp4",
    "07-port":         "Model_animating_quay_scale_model_202608281300.mp4",
    "08-air":          "Vehicles_moving_around_parked_ai…3303.mp4",  # fixed below
    "09-customs":      "Scale_model_animation_instructions_1080p_202608281310.mp4",
    "10-lastmile":     "Blue_vans_driving_in_city_202608281312.mp4",
    "12-exception":    "Animate_static_truck_image_1080p_202608281331.mp4",
    "13-orchestrator": "Animate_scale_model_movement_1080p_202608281317.mp4",
}
# the air filename carries a unicode ellipsis; resolve it by prefix instead of guessing
SCENES["08-air"] = None


def resolve_air():
    for f in os.listdir(SRC_DIR):
        if f.startswith("Vehicles_moving_around_parked_ai") and f.endswith(".mp4"):
            return f
    return None


def sample_backdrop(path, vf=None):
    """Mean RGB of the backdrop corner, as a single 0-255 value."""
    chain = ((vf + ",") if vf else "") + SAMPLE_CROP + ",scale=1:1"
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", SAMPLE_AT, "-i", path, "-frames:v", "1",
         "-vf", chain, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True,
    ).stdout
    return None if len(out) < 3 else round((out[0] + out[1] + out[2]) / 3)


def grade_for(measured):
    """Black-point lift that maps `measured` to TARGET.

    colorlevels romin maps input i to  romin*255 + i*(1-romin), so solving for the
    lift that lands on TARGET gives (TARGET - i) / (255 - i).
    """
    if measured is None or measured >= TARGET or measured >= 255:
        return None
    r = (TARGET - measured) / (255.0 - measured)
    # A black-point raise compresses everything into the top of the range, so a large
    # lift flattens the picture - on a white-object-on-white-plate shot it erases the
    # subject. Cap it: a clip needing more than this is too far off to rescue by
    # grading and should be regenerated instead. main() reports those.
    capped = min(r, MAX_LIFT)
    if capped < 0.02:
        return None
    return f"colorlevels=romin={capped:.3f}:gomin={capped:.3f}:bomin={capped:.3f}"


def encode(scene, src_name):
    src = os.path.join(SRC_DIR, src_name)
    if not os.path.exists(src):
        print(f"  {scene:16} SKIP - source not found: {src_name}")
        return

    before = sample_backdrop(src)
    grade = grade_for(before)
    pre = "reverse," if scene in REVERSE else ""
    vf_video = pre + (grade + "," if grade else "") + SCALE
    vf_poster = pre + (grade + "," if grade else "") + POSTER_SCALE

    mp4 = os.path.join(OUT, scene + ".mp4")
    jpg = os.path.join(OUT, scene + ".jpg")

    start, dur = TRIM.get(scene, (0.0, None))
    # -ss/-t before -i so ffmpeg seeks the input rather than decoding and discarding.
    seek = []
    if start:
        seek += ["-ss", str(start)]
    if dur:
        seek += ["-t", str(dur)]

    subprocess.run(["ffmpeg", "-y", "-v", "error"] + seek + ["-i", src, "-vf", vf_video]
                   + VIDEO_ARGS + [mp4], check=True)
    # Poster comes from the graded video's own first frame, so the still the page
    # shows before load is byte-for-byte the frame the video starts on.
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp4, "-frames:v", "1",
                    "-vf", POSTER_SCALE, "-q:v", "6", jpg], check=True)

    # Mobile encode, selected by a <source media> query - no JS involved.
    m_args = [a if a != "-crf" else a for a in VIDEO_ARGS]
    m_args = ["-an", "-c:v", "libx264", "-crf", MOBILE_CRF,
              "-g", "3", "-keyint_min", "3", "-sc_threshold", "0",
              "-profile:v", "main", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
    subprocess.run(["ffmpeg", "-y", "-v", "error"] + seek + ["-i", src,
                    "-vf", pre + (grade + "," if grade else "") + MOBILE_SCALE]
                   + m_args + [os.path.join(OUT, scene + "-m.mp4")], check=True)

    after = sample_backdrop(mp4)
    size = os.path.getsize(mp4) / 1e6
    msize = os.path.getsize(os.path.join(OUT, scene + "-m.mp4")) / 1e6
    tag = f"lift {before}->{after}" if grade else f"pass-through ({before})"
    if scene in TRIM:
        tag += f"  trimmed {TRIM[scene][0]}s..{TRIM[scene][1]}s"
    if scene in REVERSE:
        tag += "  reversed"
    off = after is not None and abs(after - TARGET) > 12
    print(f"  {scene:16} {size:4.1f}MB  m:{msize:3.1f}MB  {tag}{'   << still off target, regenerate' if off else ''}")


def main():
    os.makedirs(OUT, exist_ok=True)
    SCENES["08-air"] = resolve_air()
    only = sys.argv[1] if len(sys.argv) > 1 else None

    print(f"Encoding to {OUT}  (target backdrop {TARGET})")
    for scene, src in SCENES.items():
        if only and scene != only:
            continue
        if src is None:
            print(f"  {scene:16} SKIP - source not resolved")
            continue
        encode(scene, src)

    total = sum(os.path.getsize(os.path.join(OUT, f))
                for f in os.listdir(OUT)) / 1e6
    print(f"\nTotal: {total:.1f}MB")


if __name__ == "__main__":
    main()
