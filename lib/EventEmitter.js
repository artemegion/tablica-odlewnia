/**
 * @template T
 * @callback EventListenerFn
 * @param {string} eventName
 * @param {(this: EventEmitterProxy<T> & T): void} listener
 * @returns {void}
 */

/**
 * @callback DispatchEventFn
 * @param {CustomEvent} event
 * @returns {void}
 */

/**
 * @callback EmitEventFn
 * @param {string} eventName
 * @param {CustomEventInit<any>} options
 * @returns {void}
 */

/**
 * @callback Listener
 * @param {any} ev
 */

/**
 * @typedef EventListener
 * @prop {Listener} callback
 * @prop {any} thisArg
 */

export class EventEmitter {
    constructor() {
        this.#listeners = new Map();
    }

    /** @type {Map<string, EventListener[]>} */ #listeners;

    /**
     * 
     * @param {string} eventName 
     * @param {Listener} listener 
     * @param {any} [thisArg]
     */
    addEventListener(eventName, listener, thisArg = undefined) {
        if (!this.#listeners.has(eventName)) {
            this.#listeners.set(eventName, []);
        }

        let listeners = this.#listeners.get(eventName);
        listeners.push({ callback: listener, thisArg: thisArg });
    }

    /**
    * 
    * @param {string} eventName 
    * @param {Listener} listener 
    */
    removeEventListener(eventName, listener) {
        if (this.#listeners.has(eventName)) {
            let listeners = this.#listeners.get(eventName);
            let listenerIndex = listeners.findIndex(l => l.callback === listener);

            if (listenerIndex > -1) {
                listeners.splice(listenerIndex, 1);
            }
        }
    }

    /**
    *  
    * @param {string} eventName 
    * @param {Listener} listener 
    * @param {any} [thisArg]
    */
    on(eventName, listener, thisArg = undefined) {
        this.addEventListener(eventName, listener, thisArg);
    }

    /**
    *  
    * @param {string} eventName 
    * @param {Listener} listener 
    */
    off(eventName, listener) {
        this.removeEventListener(eventName, listener);
    }

    /**
     * 
     * @param {string} eventName 
     * @param {...any} ev
     */
    emit(eventName, ...ev) {
        if (this.#listeners.has(eventName)) {
            let listeners = this.#listeners.get(eventName);
            for (let listener of listeners) {
                listener.callback.call(listener.thisArg, ...ev);
            }
        }
    }
}
