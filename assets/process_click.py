"""Soften the raw keystroke recording into a more padded, muffled click.

Reads assets/click-source.wav (untouched original recording) and writes
assets/click.wav (the processed sound actually used by the app). Re-run
this after tweaking the parameters below rather than processing click.wav
repeatedly, since that would compound the filtering.
"""
import wave
import numpy as np

SRC = "click-source.wav"
OUT = "click.wav"

LOWPASS_HZ = 2200      # cut highs above this to dull the sharp "clack"
GAIN = 0.62             # overall volume scale, softer/quieter
ATTACK_MS = 6           # fade-in length to round off the transient spike


def one_pole_lowpass(x, cutoff_hz, sample_rate):
    rc = 1.0 / (2 * np.pi * cutoff_hz)
    dt = 1.0 / sample_rate
    alpha = dt / (rc + dt)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    return y


def main():
    w = wave.open(SRC, "rb")
    n_channels = w.getnchannels()
    sampwidth = w.getsampwidth()
    framerate = w.getframerate()
    n_frames = w.getnframes()
    raw = w.readframes(n_frames)
    w.close()

    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float64)
    audio = audio.reshape(-1, n_channels)

    processed = np.empty_like(audio)
    for ch in range(n_channels):
        filtered = one_pole_lowpass(audio[:, ch], LOWPASS_HZ, framerate)
        processed[:, ch] = filtered * GAIN

    attack_samples = int(framerate * ATTACK_MS / 1000)
    if attack_samples > 0:
        ramp = (1 - np.cos(np.linspace(0, np.pi, attack_samples))) / 2
        processed[:attack_samples, :] *= ramp[:, None]

    processed = np.clip(processed, -32768, 32767).astype(np.int16)

    out = wave.open(OUT, "wb")
    out.setnchannels(n_channels)
    out.setsampwidth(sampwidth)
    out.setframerate(framerate)
    out.writeframes(processed.tobytes())
    out.close()
    print(f"wrote {OUT}: {len(processed)} frames")


if __name__ == "__main__":
    main()
