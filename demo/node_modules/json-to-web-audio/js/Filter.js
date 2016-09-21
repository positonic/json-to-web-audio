import Tuna from 'tunajs';

export const Filter = (audioContext, voiceConfig) => {

    let filters = [];

    const me = {
        setUpFilters: (filterConfigs, input, output) => {

            var filter;
            let previousFilter;

            filterConfigs.forEach((filterConfig, key) => {

                if(filterConfig.tunaType !== undefined)
                {
                    filter = me.createTunaFilter(filterConfig);
                }
                else
                {
                    filter = me.createFilter(filterConfig)
                }

                filters.push(filter);

            });

            input.connect(filters[0]);

            filters.forEach((filter) => {

                if(typeof previousFilter !== "undefined")
                {
                    previousFilter.connect(filter);
                }

                previousFilter = filter;
            });

            filters[filterConfigs.length - 1].connect(output);

        },

        createFilter: (filterConfig) => {
            var filter = audioContext.createBiquadFilter();

            filter.type = filterConfig.props.type;
            filter.frequency.value = filterConfig.props.value;

            return filter;
        },

        createTunaFilter: (filterConfig) => {
            var tuna = new Tuna(audioContext);

            return new tuna[filterConfig.tunaType](filterConfig.props);

        }
    }
    return me
};