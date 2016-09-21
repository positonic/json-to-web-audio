import { Oscillator } from './Oscillator';
import { Filter } from './Filter';

export const Voice = (audioContext, voiceConfig)  => {

    return Object.assign(
        {},
        Oscillator(audioContext, voiceConfig),

        Filter(audioContext, voiceConfig)
    )
}
