import {plotFromErigonLogEvents} from "./ErigonProcessEvents";

class ErigonProvider {
    constructor() {
        this.listeners = new Set();
        this.events = null;
        this.sizes = null;
        this.last_error = null;
    }

    registerListener(eventHandler) {
        console.log("Registering component")
        this.listeners.add(eventHandler);
    }

    unregisterListener(eventHandler) {
        console.log("Unregistering component")
        this.listeners.delete(eventHandler);
    }

    getLastEror() {
        return this.last_error;
    }
    getPlotData() {
        try {
            if (this.events === null) {
                return {};
            }
            let plotData = plotFromErigonLogEvents(this.events, this.sizes);
            return plotData;
        } catch (ex) {
            console.log(ex);
        }
        return {};
    }

    marketToHist(mark) {
    }



    getProviderProperties() {
        return {
            numberOfListeners: this.listeners.size,
            callbackCount: this.callbackCount
        };
    }

    async fetchErigonProgress() {
        const response = await fetch('http://54.36.174.74:5000/events');
        const events = await response.json();
        const response2 = await fetch('http://54.36.174.74:5000/sizes');
        const sizes = await response2.json();
        this.events = events;
        this.sizes = sizes;
    }

    async updateDataLoop() {
        let updateLoopNo = 0;
        while (true) {
            while (this.listeners.size == 0) {
                this.market = null;
                this.last_error = "Waiting for data";
                await new Promise(r => setTimeout(r, 500));
            }
            try {
                await this.fetchErigonProgress();
            } catch (ex) {
                this.events = null;
                this.sizes = null;
                this.last_error = ex.message;
            } finally {
                await new Promise(r => setTimeout(r, 5000));
            }
            for (let callback of this.listeners) {
                this.callbackCount += 1;
                callback();
            }
        }
    }
}

let erigonProvider = new ErigonProvider()
erigonProvider.updateDataLoop()

export default erigonProvider;
