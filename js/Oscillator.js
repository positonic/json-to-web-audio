export const Oscillator = (audioContext, voiceConfig) => {

    let oscillators = [];

    let masterVca = audioContext.createGain();

    masterVca.gain.value = voiceConfig.gain  / 100;

    const me = {
        getOscillatorConfig(oscNumber)
        {
            return voiceConfig.oscillators[oscNumber];
        },

        createOscillatorById(oscNumber)
        {
            let oscConfig = me.getOscillatorConfig(oscNumber);

            me.createOscillator(oscConfig)
        },

        applyTuning(vco, tuning)
        {
            if(tuning !== 0)
            {
                vco.detune.value = tuning;
            }

            return vco;
        },

        setPipeLengthOnOscillator(vco, pipeLength)
        {
            if(pipeLength !== 0)
            {
                vco.pipeLength = pipeLength;
            }

            return vco;

        },

        createOscillator(oscConfig)
        {
            let vco = audioContext.createOscillator();
            vco.type = oscConfig.type;
            vco = me.applyTuning(vco, oscConfig.tuning);
            vco = me.setPipeLengthOnOscillator(vco, oscConfig.pipeLength);


            me.connectInputToVca(me.addOscillatorGain(vco, oscConfig.gain));

            return vco;
        },

        connectInputToVca: (node) => {
            node.connect(masterVca);
        },

        connectVcaToOutput: (node) => {
            masterVca.connect(node);
        },

        addOscillatorGain(vco, vcoGain) {

            var vcoGainControl = audioContext.createGain();
            vcoGainControl.gain.value = vcoGain / 100;
            vco.connect(vcoGainControl);

            return vcoGainControl;
        },

        playVoice: () => {

            oscillators.forEach(osc => {
                me.start(osc, 0, 3, 440);
            })
        },

        start: (vco, time, noteLength, frequency) => {

            vco.frequency.value = me.applyPipeLength(frequency, vco.pipeLength);

            vco.start(time);
            vco.stop(time + noteLength);
        },

        applyPipeLength: (frequency, pipeLength) => {
            return frequency / (parseInt(pipeLength, 10) / 8);
        },

        setupOscillators()
        {
            voiceConfig.oscillators.forEach(osc => {
                oscillators.push(me.createOscillator(osc));
            })

            //me.connectVcaToOutput(output);
            return masterVca;
        }
    }
    return me

};