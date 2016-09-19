const oscPlayer = (audioContext, voiceConfig) => {
    const me = {
        getOscillatorConfig(oscNumber)
        {
            return voiceConfig.oscillators[oscNumber];
        },
    
        getOscillator(oscNumber)
        {
            let oscConfig = me.getOscillatorConfig(oscNumber);
    
            let vco = audioContext.createOscillator();
            vco.type = oscConfig.waveform;
    
            return vco;
        },
    
        start: (vco, time, noteLength, frequency) => {
    
            vco.frequency.value = frequency;
    
            vco.start(time);
            vco.stop(time + noteLength);
        }
    }
    return me

};

const octave = () => ({
        applyPipeLength: (frequency, pipeLength) => {
        return frequency / (parseInt(pipeLength, 10) / 8);
    }
});

const Voice = (audioContext, voiceConfig)  => {

    return Object.assign(
        {},
        oscPlayer(audioContext, voiceConfig),
        octave()
    )
}



