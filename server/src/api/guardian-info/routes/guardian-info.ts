/**
 * guardian-info router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/guardian-infos/:id",
      handler: "guardian-info.findOne",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "GET",
      path: "/guardian-infos",
      handler: "guardian-info.find",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "POST",
      path: "/guardian-infos",
      handler: "guardian-info.create",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/guardian-infos/:id",
      handler: "guardian-info.update",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
    {
      method: "DELETE",
      path: "/guardian-infos/:id",
      handler: "guardian-info.delete",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
  ],
};
