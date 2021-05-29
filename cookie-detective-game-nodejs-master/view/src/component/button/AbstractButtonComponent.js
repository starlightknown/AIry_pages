/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import VueTypes from 'vue-types';
import bowser from 'bowser';
import {AbstractScrollComponent} from 'vue-transition-component';
import LinkType from './data/enum/LinkType';
import Size from '../../data/enum/Size';
import ButtonType from './data/enum/ButtonType';
import routes from '../../router/routes';
import Params from '../../data/enum/Params';

export default {
  name: 'AbstractButtonComponent',
  extends: AbstractScrollComponent,
  props: {
    active: VueTypes.bool.def(true),
    disabled: VueTypes.bool,
    invalid: VueTypes.bool,
    size: VueTypes.oneOf([Size.SMALL, Size.MEDIUM, Size.LARGE]).def(
        Size.MEDIUM,
    ),
    icon: VueTypes.string,
    label: VueTypes.string,
    title: VueTypes.string,
    type: VueTypes.oneOf(Object.values(ButtonType)).isRequired,
    link: VueTypes.shape({
      type: VueTypes.oneOf(Object.values(LinkType)).isRequired,
      target: VueTypes.any.isRequired,
    }),
  },
  computed: {
    buttonSize() {
      return `is-${Size[this.size].toLowerCase()}`;
    },
    target() {
      let {target} = this.link;

      if (this.link.type === LinkType.INTERNAL) {
        const link = routes.find(
            (route) => route.name === this.link.target.name,
        );
        target = link.path;

        if (this.link.target.params) {
          Object.keys(Params).forEach((key) => {
            target = target.replace(
                `:${Params[key]}`,
                this.link.target.params[Params[key]],
            );
          });
        }
      }

      return target;
    },
  },
  methods: {
    // eslint-disable-next-line
    async onClick() {},

    /**
     * @public
     * @method handleClick
     * @param {Event} event
     * @description When the user clicks on the button a action is triggered!
     */
    async handleClick(event) {
      // Always kill the default action because
      // otherwise it will execute the href
      event.preventDefault();

      // In case we want to do(wait) an animation
      // first on the click of the button
      await this.onClick();

      this.$emit('click');

      switch (this.type) {
        case ButtonType.LINK:
          switch (this.link.type) {
            case LinkType.DOWNLOAD:
              if (bowser.ios) {
                // event.preventDefault();
                this.openExternalLink(true);
              }
              break;
            case LinkType.EXTERNAL:
              // event.preventDefault();
              this.openExternalLink();
              break;
            case LinkType.EXTERNAL_BLANK:
              // event.preventDefault();
              this.openExternalLink(true);
              break;
            case LinkType.INTERNAL:
            default:
              // event.preventDefault();
              this.openInternalLink();
              break;
          }
          break;
        case ButtonType.ACTION: {
          if (event) {
            // event.preventDefault();
          }
          break;
        }
        case ButtonType.SUBMIT:
        default:
        // Leaving this empty because we always emit an event
        // and we have nothing defined for this case yet.
      }
    },

    /**
     * @public
     * @method openInternalLInk
     * @description When the type is an internal link the
     * router should navigate to the provided url
     * @return {Promise}
     */
    openInternalLink() {
      return this.$router.push(this.link.target);
    },

    /**
     * @public
     * @Method openExternalLink
     * @param {boolean} blank: open in a new window or not
     * @description When the type is an external link we
     * should open a new window with the provided target
     */
    openExternalLink(blank) {
      if (blank) {
        window.open(this.link.target);
      } else {
        window.location.href = this.link.target;
      }
    },
  },
};
