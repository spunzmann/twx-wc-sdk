import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';

(function(_PTCS) {
    'use strict';
    /**
   *
   * @class MbContainer
   * @extends {Polymer.Element|HTMLElement}
   * @memberof PTCS
   */
    _PTCS.MbContainer = class MbContainer extends PolymerElement {
        static get is() {
            return 'ptcs-mb-container';
        }

        static get properties() {
            return {
                subWidgetContainerId:
                    {
                        type:               String,
                        reflectToAttribute: true
                    },

                subWidget:
                    {
                        type:               Number,
                        reflectToAttribute: true
                    },

                disabled: {
                    reflectToAttribute: true,
                    value:              false,
                    observer:           '_disabled'
                }
            };
        }
        _disabled(val) {
            this.style.opacity = val ? 0.5 : '';
            this.style.pointerEvents = val ? 'none' : '';
        }

    };

    customElements.define(_PTCS.MbContainer.is, _PTCS.MbContainer);
}(PTCS));
