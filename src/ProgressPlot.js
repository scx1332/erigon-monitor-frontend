import Plot from 'react-plotly.js';
import erigonProvider from "./ErigonProvider";
import {useEffect, useReducer} from "react";


function ProgressPlot(props) {
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);


    const handleDataProviderChange = function () {
        forceUpdate();
    };

    useEffect( () => {
        erigonProvider.registerListener(handleDataProviderChange);
        return () => {
            erigonProvider.unregisterListener(handleDataProviderChange);
        }
    }, []);

    const render = function () {
        let plotData = erigonProvider.getPlotData();
        return (
            <div>

            <Plot
            data={plotData["plotlyData"]}
            layout={ {
                title: 'Double Y Axis Example',
                yaxis: {title: 'yaxis title'},
                yaxis2: {
                    title: 'yaxis2 title',
                    titlefont: {color: 'rgb(148, 103, 189)'},
                    tickfont: {color: 'rgb(148, 103, 189)'},
                    overlaying: 'y',
                    side: 'right'
                }
            } }
        /><Plot
                data={plotData["plotlyData2"]}
                layout={ {
                    title: 'Double Y Axis Example',
                    yaxis: {title: 'yaxis title'},
                    yaxis2: {
                        title: 'yaxis2 title',
                        titlefont: {color: 'rgb(148, 103, 189)'},
                        tickfont: {color: 'rgb(148, 103, 189)'},
                        overlaying: 'y',
                        side: 'right'
                    }
                } }
            />
            </div>)
    }
    return render();
}

export default ProgressPlot;