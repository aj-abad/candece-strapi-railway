"use strict";

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: "editorjs",
      plugin: "editorjs",
      type: "json",
      inputSize: {
        default: 12,
        isResizable: false,
      },
    });
  },
};
