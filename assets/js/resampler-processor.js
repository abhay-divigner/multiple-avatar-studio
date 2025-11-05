// resampler-processor.js
class ResamplerProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0][0];
      if (!input) return true;
  
      // Basic downsample: naive decimation
      const output = new Float32Array(Math.floor(input.length / 3));
      for (let i = 0, j = 0; i < output.length; i++, j += 3) {
        output[i] = input[j];
      }
  
      this.port.postMessage(output);
      return true;
    }
  }
  registerProcessor('resampler-processor', ResamplerProcessor);
  