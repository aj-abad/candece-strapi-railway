export default ({ env }) => ({
  editorjs: {
    enabled: true,
    resolve: "./src/plugins/editorjs",
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: { folder: "candece" },
        uploadStream: { folder: "candece" },
        delete: {},
      },
    },
  },
});
