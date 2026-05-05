import './styles/main.css';
import { initRTLDetector } from './utils/rtl';

export default class Plugin {
    initialize(registry, store) {
        // RTL detector runs as a MutationObserver — no registry hooks needed
        initRTLDetector(store);
    }

    uninitialize() {
        // MutationObserver is disconnected in rtl.js on page unload
    }
}
