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
  generate: (file: File, options: WaveformOptions) => void;
  generateFromJson: (samples: number[], options: WaveformOptions) => void;
}

declare var SoundCloudWaveform: SoundCloudWaveformType;
