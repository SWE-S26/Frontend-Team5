Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

var SoundCloudWaveform = {
  settings: {
    canvas_width: 453,
    canvas_height: 66,
    bar_width: 3,
    bar_gap: 0.2,
    wave_color: "#666",
    half: undefined,
    download: false,
    draw_divider: false,
    onComplete: function (png, pixels) {},
  },

  _getAudioContext: function () {
    if (!this.audioContext) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    return this.audioContext;
  },

  generateFromJson: function (samples, options) {
    this._applyOptions(options);

    var canvas = this.settings.canvas;
    var maxHeight = canvas.height;
    var sections = canvas.width;
    var barWidth = this.settings.bar_width;

    var numBars = Math.floor(sections / barWidth);
    var maxVal = Math.max.apply(null, samples);

    for (var i = 0; i < numBars; i++) {
      var sampleIndex = Math.floor((i / numBars) * samples.length);
      var rawVal = samples[sampleIndex];

      var val = (rawVal / maxVal) * maxHeight;
      val = Math.max(val, 10);

      this.drawBar(i * barWidth, val);
    }

    if (this.settings.download) {
      this.generateImage();
    }

    this.settings.onComplete(
      canvas.toDataURL("image/png"),
      this.settings.context.getImageData(0, 0, canvas.width, canvas.height),
    );

    this.settings.context.clearRect(0, 0, canvas.width, canvas.height);
  },

  exportJson: function (file, numSamples, filename) {
    numSamples = numSamples || 200;
    filename = filename || "waveform.json";

    var reader = new FileReader();
    reader.onload = function (event) {
      SoundCloudWaveform._getAudioContext().decodeAudioData(
        event.target.result,
        function (buffer) {
          var channelData = buffer.getChannelData(0);
          var sectionLen = Math.floor(channelData.length / numSamples);
          var samples = [];

          for (var i = 0; i < numSamples; i++) {
            var sum = 0;
            var start = i * sectionLen;
            for (var j = start; j < start + sectionLen; j++) {
              sum += channelData[j] * channelData[j];
            }
            var rms = Math.sqrt(sum / sectionLen);
            samples.push(parseFloat((rms * 10000).toFixed(6)));
          }

          var blob = new Blob([JSON.stringify(samples, null, 2)], {
            type: "application/json",
          });

          var url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          link.click();
          URL.revokeObjectURL(url);
        },
      );
    };

    reader.readAsArrayBuffer(file);
  },

  _applyOptions: function (options) {
    options = options || {};

    this.settings.canvas = document.createElement("canvas");
    this.settings.context = this.settings.canvas.getContext("2d");

    this.settings.canvas.width =
      options.canvas_width !== undefined
        ? parseInt(options.canvas_width)
        : this.settings.canvas_width;

    this.settings.canvas.height =
      options.canvas_height !== undefined
        ? parseInt(options.canvas_height)
        : this.settings.canvas_height;

    this.settings.wave_color =
      options.wave_color !== undefined
        ? options.wave_color
        : this.settings.wave_color;

    this.settings.bar_width =
      options.bar_width !== undefined
        ? parseInt(options.bar_width)
        : this.settings.bar_width;

    this.settings.bar_gap =
      options.bar_gap !== undefined
        ? parseFloat(options.bar_gap)
        : this.settings.bar_gap;

    this.settings.half = options.half !== undefined ? options.half : undefined;

    this.settings.download =
      options.download !== undefined
        ? options.download
        : this.settings.download;

    this.settings.onComplete =
      options.onComplete !== undefined
        ? options.onComplete
        : this.settings.onComplete;
  },

  extractBuffer: function (buffer) {
    buffer = buffer.getChannelData(0);
    var sections = this.settings.canvas.width;
    var len = Math.floor(buffer.length / sections);
    var maxHeight = this.settings.canvas.height;
    var vals = [];

    for (var i = 0; i < sections; i += this.settings.bar_width) {
      vals.push(this.bufferMeasure(i * len, len, buffer) * 10000);
    }

    for (var j = 0; j < sections; j += this.settings.bar_width) {
      var scale = maxHeight / vals.max();
      var val = this.bufferMeasure(j * len, len, buffer) * 10000;
      val *= scale;
      val += 1;
      this.drawBar(j, val);
    }

    if (this.settings.download) {
      this.generateImage();
    }

    this.settings.onComplete(
      this.settings.canvas.toDataURL("image/png"),
      this.settings.context.getImageData(
        0,
        0,
        this.settings.canvas.width,
        this.settings.canvas.height,
      ),
    );

    this.settings.context.clearRect(
      0,
      0,
      this.settings.canvas.width,
      this.settings.canvas.height,
    );
  },

  bufferMeasure: function (position, length, data) {
    var sum = 0.0;
    for (var i = position; i <= position + length - 1; i++) {
      sum += Math.pow(data[i], 2);
    }
    return Math.sqrt(sum / data.length);
  },

  drawBar: function (i, h) {
    var ctx = this.settings.context;
    var canvasHeight = this.settings.canvas.height;
    var barWidth = this.settings.bar_width;

    var w =
      this.settings.bar_gap !== 0
        ? Math.floor(barWidth * Math.abs(1 - this.settings.bar_gap))
        : barWidth;

    var x = i;

    var dividerY = Math.floor(canvasHeight * 0.55);

    var normalized = h / canvasHeight;
    var curved = Math.pow(normalized, 1.2);

    var topH = Math.min(curved * dividerY * 1, dividerY);
    var bottomH = Math.min(topH * 0.35, canvasHeight - dividerY);

    var drawTop = this.settings.half !== "bottom";
    var drawBottom = this.settings.half !== "top";

    if (this.settings.wave_color === "gradient") {
      if (drawTop) {
        var topGrad = ctx.createLinearGradient(0, dividerY - topH, 0, dividerY);
        topGrad.addColorStop(0, "#ff6100");
        topGrad.addColorStop(1, "#ff1100");
        ctx.fillStyle = topGrad;
        ctx.fillRect(x, dividerY - topH, w, topH);
      }

      if (drawBottom) {
        ctx.fillStyle = "#c49478";
        ctx.fillRect(x, dividerY, w, bottomH);
      }
    } else {
      ctx.fillStyle = this.settings.wave_color;

      if (drawTop) {
        ctx.fillRect(x, dividerY - topH, w, topH);
      }

      if (drawBottom) {
        ctx.fillRect(x, dividerY, w, bottomH);
      }
    }
  },

  generateImage: function () {
    var image = this.settings.canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.href = image;
    link.setAttribute("download", "");
    link.click();
  },
};

export default SoundCloudWaveform;
