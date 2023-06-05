import { LitElement } from '../../vendor/lit.js';
import { EventEmitter } from '../EventEmitter.js';

export class State extends EventEmitter {
    constructor() {
        super();
        let self = this;

        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (typeof target[prop] === 'function') {
                    if (!this['$fn$']) this['$fn$'] = {};

                    if (!this['$fn$'][prop]) {
                        this['$fn$'][prop] = target[prop].bind(target);
                    }

                    return this['$fn$'][prop];
                }

                return target[prop];
            },

            set: (target, prop, value, receiver) => {
                if (target[prop] !== value) {
                    target[prop] = value;
                    self.emit('property-changed', prop);
                }

                return true;
            }
        });
    }

    /**
     * 
     * @param {LitElement} observer 
     * @param {string[]} [properties]
     */
    observe(observer, properties) {
        this.on('property-changed', (propName) => {
            if (properties === undefined) {
                // observer.requestUpdate(propName, undefined);
                observer.update(new Map());
            } else {
                // if (properties.includes(propName)) observer.requestUpdate(propName, undefined);
                if (properties.includes(propName)) observer.update(new Map());
            }
        });
    }
}