/* eslint-disable */
'use strict';

/* Dependencies. */
var has = require('has');
var toH = require('hast-to-hyperscript');

/* Expose `rehype-react`. */
module.exports = rehype2react;

/**
 * Attach a react compiler.
 *
 * @param {Unified} processor - Instance.
 * @param {Object?} [options]
 * @param {Object?} [options.components]
 *   - Components.
 * @param {string?} [options.prefix]
 *   - Key prefix.
 * @param {Function?} [options.createElement]
 *   - `h()`.
 */
function rehype2react(options) {
  var settings = options || {};
  var createElement = settings.createElement;
  var components = settings.components || {};

  this.Compiler = compiler;

  /* Compile HAST to React. */
  function compiler(node) {
    if (node.type === 'root') {
      if (node.children.length === 1 && node.children[0].type === 'element') {
        node = node.children[0];
      } else {
        node = {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: node.children
        };
      }
    }

    return toH(h, node, settings.prefix);
  }

  /* Wrap `createElement` to pass components in. */
  function h(name, props, children) {
    const component = has(components, name) ? components[name] : name;

    const realProps = {
      ...props
    }

    // const propNames = Object.keys(realProps)
    // for (let i = 0; i < propNames.length; ++i) {
    //   const name = propNames[i]
    //   const prop = props[name]
    //   if (typeof prop === 'string' && prop.length > 4 && prop.match(/\{\{.+\}\}/)) {
    //     // Object prop to convert
    //     console.log(prop)
    //   }
    // }

    return createElement(component, realProps, children);
  }
}
