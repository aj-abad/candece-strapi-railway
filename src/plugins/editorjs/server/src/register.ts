import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "editorjs",
    plugin: "editorjs",
    type: "json",
    inputSize: {
      default: 12,
      isResizable: false,
    },
  });
};
