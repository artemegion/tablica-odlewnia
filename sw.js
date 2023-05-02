/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 

import { MyWorker } from './sw/MyWorker.js';

(() => {
    let worker = new MyWorker();
    worker.init();
})();
