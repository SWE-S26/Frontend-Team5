interface WaveformOptions {
  canvas_width?: number;
  canvas_height?: number;
  bar_width?: number;
  bar_gap?: number;
  wave_color?: string;
  download?: boolean;
  onComplete?: (png: string, pixels: ImageData) => void;
}

interface SoundCloudWaveformType {
  /** Generate a waveform image from an audio File object. */
  generate: (file: File, options: WaveformOptions) => void;

  /**
   * Generate a waveform image from a pre-computed JSON sample array.
   * Samples are positive numbers (e.g. RMS × 10000); they are normalised internally.
   */
  generateFromJson: (samples: number[], options: WaveformOptions) => void;

  /**
   * Decode an audio File, extract amplitude samples, and download them as a .json file.
   * Use this to pre-compute and cache waveform data server-side later.
   *
   * @param file       - The audio file to analyse
   * @param numSamples - How many data points to include (default: 200)
   * @param filename   - Download filename (default: "waveform.json")
   */
  exportJson: (file: File, numSamples?: number, filename?: string) => void;
}

declare var SoundCloudWaveform: SoundCloudWaveformType;
