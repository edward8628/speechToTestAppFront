import React from 'react';

class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  componentDidMount() {
    var token = 'yPKO7Moo0O2hF4GZ0jh6rsR0NBSDWwW3JeQuyLiCM3Dp1ByzReALsGjweGfIxX%2FLzavFLTOfLc32%2BVEMDn3ZkoBOnWBfJzEfnUMAKGg%2B8YIpPZK2BJGCFDK5EEK7KMRPkWtpR6ymT2oizH5aOH5CFi%2BUqYqMxLY1mAMKCtQBI0Fsk7fMfI0hprJ09rPNsnJEkxGYYTvUJtkYC%2BqD5TpRHktpIupeBZvh1B2ROG3Ue8WS5rC%2F9qgHjBS1towlqynLfuoKRceeeAci5DF5le0bHaiyIaVBGL8e2UzDIlycbRSpQrqHFy2JZp8%2FjDdcBdvpfCzWbbdFl3gEHcHHsDgbnYA51Nk5dfTBTawb0yAUI4rqkFHHTulmDXbPB1%2FElXzW4Th6NuNoZZgX7s3aCCbjW71mu4MJ6OaKS%2FvdPNpZwshEqSv7GGDECOrWqbb71jFC1Tqe%2BNq%2BpXlhTFi5LI%2BvehWXu3k%2BxE2wTaa%2FgmANmHiD5aqKIjEMhidhkjEOB%2FZco%2B2V1X2tgf1txt%2Fd10xL4dnRGnwTQO%2B6FWBqR%2FKyQ1uHT0qPIAlXgGE%2BA9C8kuY0Cz%2Bs6zRwgjQZ%2F8C0EoBgO3scH1VR%2F7EQtvuO%2FClNw8A0HvmFs3pu2QMp63AiwPX1UzXqUfuInNOUS9ZQusIh72O2HFU7loRHIfDhoqG3ePkNU7gYwMVa%2BdZ0lz5NsQkdYgfCjiZXdehtDJPIw3cSgaaWsyfWwLCvfsn2YA6UuTohLSeGQKIvPS0It%2FmMShQTV2sYYYWTvHMwHYjxUQ16lg8VyxPvamWjiHSPfpMrfH%2Fv4pkWVOlfBHrEvL63GIXU8ny%2F1jzD86Lqz65NjUKmhWjqlhsFEwGyGWlTukcK35bqGxaIZTiDpS1Od%2FHdfpKNEdb6Atud2tkLUa6FimCttaKPSzZqHqbamBURBIFjAf8NQpg868oExRJ0RXB17FIC';
    var wsURI = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token;
    this.websocket = new WebSocket(wsURI);
    this.websocket.onopen = (evt) => { this.onOpen(evt) };
    this.websocket.onclose = (evt) => { this.onClose(evt) };
    this.websocket.onmessage = (evt) => { this.onMessage(evt) };
    this.websocket.onerror = (evt) => { this.onError(evt) };
  }
    
  onError = (evt) => {
    console.log('onError', evt);
  }
  
  onClose = (evt) => {
    console.log('onClose', evt);
  }
  
  onOpen = (evt) => {
    console.log('onOpen');
    var message = {
      'action': 'start',
      'content-type': 'audio/l16;rate=16000',
      'interim_results': true,
      'continuous': true,
      'max_alternatives': 3,
      'inactivity_timeout': 600,
      'word_alternatives_threshold': 0.001,
      'smart_formatting': true,
      'word_confidence': false,
      'timestamps': false
    };
    this.websocket.send(JSON.stringify(message));
  }
  
  //callback message from server
  onMessage = (evt) => {
    // console.log('onMessage', evt);
    var msg = JSON.parse(evt.data);
    if (msg.results) {
      var text = msg.results[0].alternatives[0].transcript || '';
      console.log('text', text);
    }
  }
  
  //every time when new data in buffer
  onAudio = (blob) => {
    // console.log('onAudio');
    //if (this.websocket.readyState < 2) {
      this.websocket.send(blob);
    //}
    
  }
  
  closeMicrophone = () => {
    // websocket.send(JSON.stringify({action: 'stop'}));
  }
  
  openMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true})
    .then((stream) => {
      var context = new AudioContext();
      var audio = context.createMediaStreamSource(stream);

      // create a ScriptProcessorNode
      var bufferSize = 2048;
      var recorder = context.createScriptProcessor(bufferSize, 1, 1);
      
      // specify the processing function
      recorder.onaudioprocess = (e) => {
        var left = e.inputBuffer.getChannelData(0);
        // this.saveData(new Float32Array(left));
        // this.onAudio(this.exportDataBufferTo16Khz(new Float32Array(left)));
        this.onAudio(this.exportDataBufferTo16Khz(new Float32Array(left)));
        
      }
      
      // connect stream to our recorder
      audio.connect(recorder);
      // connect our recorder to the previous destination
      recorder.connect(context.destination);
    })
  }

  exportDataBufferTo16Khz = (bufferNewSamples) => {
    var buffer = null,
      newSamples = bufferNewSamples.length,
      unusedSamples = new Float32Array(0),
      audioContextSampleRate = 44100;
      
    if (unusedSamples > 0) {
      buffer = new Float32Array(unusedSamples + newSamples);
      for (var i = 0; i < unusedSamples; ++i) {
        buffer[i] = this.bufferUnusedSamples[i];
      }
      for (i = 0; i < newSamples; ++i) {
        buffer[unusedSamples + i] = bufferNewSamples[i];
      }
    } else {
      buffer = bufferNewSamples;
    }

    // downsampling variables
    var filter = [
        -0.037935, -0.00089024, 0.040173, 0.019989, 0.0047792, -0.058675, -0.056487,
        -0.0040653, 0.14527, 0.26927, 0.33913, 0.26927, 0.14527, -0.0040653, -0.056487,
        -0.058675, 0.0047792, 0.019989, 0.040173, -0.00089024, -0.037935
      ],
      samplingRateRatio = audioContextSampleRate / 16000,
      nOutputSamples = Math.floor((buffer.length - filter.length) / (samplingRateRatio)) + 1,
      pcmEncodedBuffer16k = new ArrayBuffer(nOutputSamples * 2),
      dataView16k = new DataView(pcmEncodedBuffer16k),
      index = 0,
      volume = 0x7FFF, // range from 0 to 0x7FFF to control the volume
      nOut = 0;

    // eslint-disable-next-line no-redeclare
    for (var i = 0; i + filter.length - 1 < buffer.length; i = Math.round(samplingRateRatio * nOut)) {
      var sample = 0;
      for (var j = 0; j < filter.length; ++j) {
        sample += buffer[i + j] * filter[j];
      }
      sample *= volume;
      dataView16k.setInt16(index, sample, true); // 'true' -> means little endian
      index += 2;
      nOut++;
    }

    var indexSampleAfterLastUsed = Math.round(samplingRateRatio * nOut);
    var remaining = buffer.length - indexSampleAfterLastUsed;
    if (remaining > 0) {
      this.bufferUnusedSamples = new Float32Array(remaining);
      for (i = 0; i < remaining; ++i) {
        this.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
      }
    } else {
      this.bufferUnusedSamples = new Float32Array(0);
    }

    return new Blob([dataView16k], {
      type: 'audio/l16'
    });
  }
  
  render() {
    return (
      <div>
        <h2>Frontend App</h2>
        <button onClick={this.openMicrophone}>Open Microphone</button>
        <button onClick={this.closeMicrophone}>Close Microphone</button>
      </div>
    )
  }
}

export default User;

