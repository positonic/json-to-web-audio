# json-to-web-audio

json-to-web-audio allows you to specify oscillators and filters as JSON, and it will automatically create the necessary Web audio api nodes and filters, and link them together, and send the result to your speakers.

You can specify any standard web audio filters, and it also includes support for the wonderful link to the wonderful [TunaJS](https://github.com/Theodeus/tuna) filters..

To install:

     npm install json-to-web-audio
     
To see it working run: 
 
     npm start

Then visit http://localhost:8080/webpack-dev-server/

To use, first specify your json:

      nodeVoiceConfig = {
            oscillators : [
                {
                    type: "sine",
                    pipeLength: 32,
                    gain: 100,
                    filter: 1000,
                    tuning: 0
                },
                {
                    type: "sine",
                    pipeLength: 8,
                    gain: 100,
                    filter: 1000,
                    tuning: 700
                }
            ],
            gain: 100,
            filters: [
                {
                    type: 'filter',
                    props: {
                        type: "lowpass",
                            value: 1000
                    }
                },
                {
                    type: 'filter',
                    tunaType: 'Chorus',
                    props: {
                        rate: 1.5,
                            feedback: 0.2,
                            delay: 0.0045,
                            bypass: 0
                    }
                },
                {
                    type: 'filter',
                    tunaType: "Delay",
                    props: {
                        feedback: 0.45,    //0 to 1+
                            delayTime: 150,    //1 to 10000 milliseconds
                            wetLevel: 0.25,    //0 to 1+
                            dryLevel: 1,       //0 to 1+
                            cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
                            bypass: 0
                    }
                },
                {
                    type: 'filter',
                    tunaType: "Phaser",
                    props: {
                        rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
                            depth: 0.3,                    //0 to 1
                            feedback: 0.2,                 //0 to 1+
                            stereoPhase: 30,               //0 to 180
                            baseModulationFrequency: 700,  //500 to 1500
                            bypass: 0
                    }
                }
            ]
        }
        ],

        gain: 100

    };
    
...and then run it like so:

     let voice = Voice(context, voiceConfig);
     
     var masterVca = voice.setupOscillators();
     let filterInput = voice.setUpFilters(voiceConfig.filters, masterVca, context.destination);
     
     voice.play();