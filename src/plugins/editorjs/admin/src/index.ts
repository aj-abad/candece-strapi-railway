import { PLUGIN_ID } from "./pluginId";

export default {
  register(app: any) {
    app.customFields.register({
      name: "editorjs",
      pluginId: PLUGIN_ID,
      type: "json",
      intlLabel: {
        id: `${PLUGIN_ID}.field.label`,
        defaultMessage: "Editor.js",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.field.description`,
        defaultMessage: "Rich text editor powered by Editor.js",
      },
      components: {
        Input: async () =>
          import("./components/EditorJsInput").then((m) => ({
            default: m.EditorJsInput,
          })),
      },
      options: {
        base: [],
        advanced: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.options.advanced.section`,
              defaultMessage: "Editor.js Settings",
            },
            items: [
              {
                name: "options.placeholder",
                type: "string",
                intlLabel: {
                  id: `${PLUGIN_ID}.options.placeholder.label`,
                  defaultMessage: "Placeholder",
                },
                description: {
                  id: `${PLUGIN_ID}.options.placeholder.description`,
                  defaultMessage:
                    "Placeholder text shown when the editor is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },
};
