export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "60d",
      },
    },
  },
  plugins: [
    {
      name: "users-permissions",
    },
  ],
});
