import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-image/ptcs-image.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-modal-overlay/ptcs-modal-overlay.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
<style>
div[part=popup-container] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99998;
}


div[part=modal-image-popup] {
  display: flex;
  flex-direction: column;
  background-color: white;
  box-sizing: border-box;
  min-width: 600px;
  max-height: 600px;
  position: relative;
  z-index: 99998;
  pointer-events: auto;
  border: solid silver 1px;
}

div[part=live-art-area-image-popup] {
  height: 445px;
  width: 800px;
  padding-left: 42px;
  padding-bottom: 42px;
  padding-right: 42px;
  margin-top: 66px;
  box-sizing: border-box;
  }

div[part=popup-contents-and-button] {
  display: flex;
  flex-direction: column;
  background-color: white;
  box-sizing: border-box;
  border: solid #d8dbde 1px;
  filter: drop-shadow(0 0 3rem #232323);
  }

 div[part=popup-close-button-container] {
  align-self: flex-end;
  position: fixed;
  height: 34px;
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>

<dom-module id="ptcs-modal-image-popup">
  <template>
    <style>

      :host([disabled]) {
        pointer-events: none;
      }

      :host([disabled]) [part=popup-container]::selection {
        background-color: transparent;
      }

      [part=popup-link] {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }


      [part=live-art-image-thumbnail] {
        align-self: center;
      }

      [part=disclosure-button-container],
      [part=popup-close-button-container] {
        display: flex;
        height: 34px;
        width: 34px;
        align-self: flex-end;
      }

      [part=popup-container] {
        display: none;
      }

      [part=live-art-area-image-popup] {
        height: 445px;
        width: 800px;
        padding-left: 8px;
        padding-bottom: 8px;
        padding-right: 8px;
      }

      :host([_showpopup]) [part=disclosure-button-container] {
        pointer-events: none;
      }

      :host([_showpopup]) [part=popup-container] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 99998;
      }

      [part=popup-root] {
        white-space: no-wrap;
        display: inline-block;
        border: solid #d8dbde 1px;
        min-height: 61px;
        min-width: 36px;
      }

      [part=popup-contents-and-button] {
        display: flex;
        flex-direction: column;
        background-color: white;
        box-sizing: border-box;
        border: solid #d8dbde 1px;
      }

      [part=live-art-area-image-thumbnail] {
        min-height: 18px;
        min-width: 18px;
        max-height: 158px;
        max-width: 284px;
      }

    </style>

    <div part="popup-root" id="root">
      <div part="popup-link">
          <div part="live-art-area-image-thumbnail" style$="[[ _computeStyle(src, height, width)]]">
            <ptcs-image part="image" src="[[src]]" size="contain" position="center"></ptcs-image>
          </div>
          <div part="disclosure-button-container" on-click="open">
            <ptcs-button variant="small" partmap="* open-button-*" id="open" part="disclosure-button" mode="icon"
               icon="page:expand-larger" ></ptcs-button>
        </div>
      </div>
    </div>
  </template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);

PTCS.ImagePopup = class extends PTCS.BehaviorStyleable(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.ThemableMixin(PolymerElement))) {
    static get is() {
        return 'ptcs-modal-image-popup';
    }

    static get properties() {
        return {

            src: {
                type: String
            },

            _showpopup: { // Toggle to show or hide the dialog
                type:               Boolean,
                reflectToAttribute: true
            },

            // Modal backdrop related properties follow
            backdropColor: { // Modal backdrop color
                type: String
            },

            backdropOpacity: { // Modal backdrop opacity
                type: String
            },

            disabled: { // Prevents pop-up when true
                type:               Boolean,
                reflectToAttribute: true
            },

            // Height constraint in pixels
            height: {
                type:  Number,
                value: 201, // VD default 158 plus height of disclosure button, padding, borders

            },

            // Width constraint in pixels
            width: {
                type:  Number,
                value: 301, // VD default 248 plus padding and borders
            }

        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        this.close();
        if (this._dialog) {
            document.body.removeChild(this._dialog);
        }
        super.disconnectedCallback();
    }

    open() {
        if (!this._showpopup) { // If we are not showing a modal background / dialog...
            if (!this.disabled) {

                // Create the modal overlay and style it
                let mdl = document.createElement('ptcs-modal-overlay');
                if (this.backdropColor) {
                    mdl.backdropColor = this.backdropColor;
                }
                if (this.backdropOpacity) {
                    mdl.backdropOpacity = this.backdropOpacity;
                }
                document.body.appendChild(mdl); // Insert backdrop as child of body
                if (this._dialog) {
                    document.body.removeChild(this._dialog);
                }
                // Generate the <div part=popup-container dynamically on-demand, each time the disclosure button is clicked
                // <div part="popup-container">
                //   <div part="modal-image-popup">
                //     <div part="popup-contents-and-button">
                //       <div part="popup-close-button-container" on-click="close">
                //          <ptcs-button variant="small" partmap="* close-button-*" id="close" part="popup-close-button" mode="icon"
                //                       icon="page:alt-close"></ptcs-button>
                //       </div>
                //       <div id="popup" part="popup-contents">
                //         <div part="live-art-area-image-popup">
                //           <ptcs-image part="image" src="[[src]]" size="contain" position="center"></ptcs-image>
                //         </div>
                //       </div>
                //     </div>
                //   </div>

                // div part=popup-close-button-container
                let pcbc = document.createElement('div');
                pcbc.part = 'popup-close-button-container';
                pcbc.addEventListener('click', () => this.close());

                // ptcs-button part=popup-close-button
                let pb = document.createElement('ptcs-button');
                pb.variant = 'small';
                pb.setAttribute('partmap', '* close-button-*');
                pb.id = 'close';
                pb.part = 'popup-close-button';
                pb.mode = 'icon';
                pb.setAttribute('icon', 'page:alt-close');
                pcbc.appendChild(pb);

                // div part=live-art-area-image-popup
                let laaip = document.createElement('div');
                laaip.part = 'live-art-area-image-popup';

                // ptcs-image part=image
                let pi = document.createElement('ptcs-image');
                pi.part = 'image';
                pi.src = this.src;
                pi.size = 'contain';
                pi.position = 'center';
                laaip.appendChild(pi);

                // div part=popup-contents
                let pcts = document.createElement('div');
                pcts.part = 'popup-contents';
                pcts.id = 'popup';
                pcts.appendChild(laaip);

                // div part=popup-contents-and-button
                let pcab = document.createElement('div');
                pcab.part = 'popup-contents-and-button';
                pcab.appendChild(pcbc);
                pcab.appendChild(pcts);

                // div part=modal-image-popup
                let mip = document.createElement('div');
                mip.part = 'modal-image-popup';
                mip.appendChild(pcab);

                // root div part=popup-container
                let pc = document.createElement('div');
                pc.part = 'popup-container';
                pc.appendChild(mip);

                this._dialog = document.body.appendChild(pc);
                this._showpopup = true;

                // Store the current 'focus' element (in a PD, this is the PD itself and not the VD)
                this.__prevFocusElt = document.activeElement;

                if (this.__prevFocusElt) {
                    // "Un-focus" while the popup is open
                    this.__prevFocusElt.blur();
                }

                // Add an event listener that prevents the user from tabbing out of the modal dialog and
                // allows closing it with <ESC> or <Space>
                requestAnimationFrame(() => {
                    if (!this._captureTab) {
                        this._captureTab = (ev) => {
                            switch (ev.which) {
                                case 27: // <ESC>
                                case 32: // <Space>
                                    this.close();
                                    // Fall through to next case (preventDefault())
                                case 9: // <TAB>
                                    ev.preventDefault();
                                    break;
                            }
                        };
                    }
                    document.addEventListener('keydown', this._captureTab);
                });
            }
        }
    }

    close() { // Close the dialog, delete the modal background overlay and emit popup-close-action event
        if (this._showpopup) { // Close the dialog and remove the modal background overlay
            const mdl = document.body.querySelector('ptcs-modal-overlay');
            mdl.parentNode.removeChild(mdl); // Remove the modal overlay
            var vdWidget = this.$.root;
            while (vdWidget.parentNode) {
                vdWidget = vdWidget.parentNode;
                if (vdWidget.nodeType === 11) { // Fragment
                    vdWidget = vdWidget.host;
                }
                if (vdWidget.nodeName === 'PTCS-VALUE-DISPLAY') {
                    break;
                }
            }
            if (vdWidget.nodeName === 'PTCS-VALUE-DISPLAY') {
                vdWidget.dispatchEvent(new CustomEvent('popup-close-action'), {
                    bubbles:  true,
                    composed: true
                });

            } else {
                this.dispatchEvent(new CustomEvent('popup-close-action'), {
                    bubbles:  true,
                    composed: true
                });
            }
            this._dialog.style.display = 'none';
            this._showpopup = false;

            // Remove the "global" event listener for the "modal" popup
            document.removeEventListener('keydown', this._captureTab);

            // Restore focus to "main" part of the component
            if (this.__prevFocusElt) {
                this.__prevFocusElt.focus();
                this.__prevfocusElt = undefined;
            }
        }
    }

    _computeSizeConstraint(height, width) {
        return height === undefined && width === undefined;
    }

    _computeStyle(src, height, width) {
    /* We must have enough height / width for the minimum size: 18px x 18px for the thumbnail image and 34px x 34px hit area with its
       18px x 18px disclosure button, plus border 1px all around
    */
        let p = 'padding-left: 7px; padding-top: 7px;  padding-right: 7px; ';
        if (src) {
            if (height || width) {
                if (height > 78) {
                    p += 'height: ' + (height - 52) + 'px;'; // Space needed for the disclosure button + border, bottom padding, external padding
                } else {
                    p += 'height: 18px;';
                }
                if (height > 78) {
                    let adjustedW = height * 1.8 < width ? height * 1.8 - 33 : width - 33;
                    p += 'width: ' + adjustedW + 'px;';
                } else if (width > 51) {
                    p += 'width: ' + (width - 33) + 'px;'; // Need room for padding + border on the sides, external padding
                } else {
                    p += 'width: 18px;';
                }
            }
        }
        return p;
    }
};

customElements.define(PTCS.ImagePopup.is, PTCS.ImagePopup);
