"use strict";

const Oscillators = (audioContext, voiceConfig) => {

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
                /* Object.defineProperty(vco, 'pipeLength', {
                 get: function(){
                 return oscillator.pipeLength
                 },
                 set: function(value){
                 oscillator.pipeLength = value
                 }
                 })*/
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
/*

 const vca = (audioContext, voiceConfig) => {

 let masterVca = audioContext.createGain();
 masterVca.gain.value = voiceConfig.gain  / 100;

 const me = {
 connectInputToVca: (node) => {
 node.connect(masterVca);
 },
 connectVcaToOutput: (node) => {
 vca.connect(node);
 }
 }
 return me

 };
 */

const audioNodes = (audioContext, voiceConfig) => {

    let masterVca = audioContext.createGain();
    masterVca.gain.value = voiceConfig.gain  / 100;

    const me = {

        createNodes(nodeConfigs)
        {
            let nodes = [];
            let oscillators = nodeConfigs.filter(nodeConfig => {
                return nodeConfig.type == 'oscillator';
            });

            oscillators.forEach(() => {
                nodes = createOscillator(nodeConfig);
            });

            debugger

            /*
             audioNodesConfigs.forEach(nodeConfig => {
             if(nodeConfig.type == 'oscillator')
             {
             nodes.push(me.createOscillator(nodeConfig));
             }
             else if()

             })
             */
            //me.connectVcaToOutput(output);
            return masterVca;
        },

        connectInputToVca: (node) => {
            node.connect(masterVca);
        },
        connectVcaToOutput: (node) => {
            vca.connect(node);
        }
    }
    return me

};

const octave = () => ({
    applyPipeLength: (frequency, pipeLength) => {
        return frequency / (parseInt(pipeLength, 10) / 8);
    }
});

const Filters = (audioContext, voiceConfig) => {

    /*let masterVca = audioContext.createGain();
     masterVca.gain.value = voiceConfig.gain  / 100;
     */

    let filters = [];

    const me = {
        setUpFilters: (filterConfigs, input, output) => {
            var filter;
            let lastFilter;

            filterConfigs.forEach((filterConfig, key) => {
                filter = me.createFilter(filterConfig)
                filters.push(filter);

                if(typeof lastFilter !== "undefined")
                {
                    lastFilter.connect(filter);
                }

                lastFilter = Object.assign({}, filter);
            });

            input.connect(filters[0]);
            filters[filterConfigs.length - 1].connect(output);

        },

        createFilter: (filterConfig) => {
            var filter = audioContext.createBiquadFilter();

            filter.type = filterConfig.type;
            filter.frequency.value = filterConfig.value;

            return filter;
        },

        /*connectFiltersToOutput: (output) => {

         },

         connectFiltersToOutput: (node) => {
         // vca.connect(node);lowpassFilter.connect(this.context.destination);
         }*/
    }
    return me
};

const Voice = (audioContext, voiceConfig)  => {

    return Object.assign(
        {},
        Oscillators(audioContext, voiceConfig),
        //octave(),
        Filters(audioContext, voiceConfig),
        audioNodes(audioContext, voiceConfig)

        /*,
         vca(audioContext, voiceConfig)*/
    )
}

