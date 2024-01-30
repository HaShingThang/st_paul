/**
 * grade router
 */

export default {
  routes: [
    // {
    //   method: "GET",
    //   path: "/grades/:id",
    //   handler: "grade.findOne",
    //   config: {
    //     middlewares: ["global::is-auth"],
    //     policies: ["global::is-auth"],
    //   },
    // },
    {
      method: "GET",
      path: "/grades",
      handler: "grade.find",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "POST",
      path: "/grades",
      handler: "grade.create",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
    // {
    //   method: "PUT",
    //   path: "/grades",
    //   handler: "grade.update",
    //   config: {
    //     middlewares: ["global::is-auth"],
    //     policies: ["global::is-auth"],
    //   },
    // },
    // {
    //   method: "DELETE",
    //   path: "/grades/:id",
    //   handler: "grade.delete",
    //   config: {
    //     middlewares: ["global::is-auth"],
    //     policies: ["global::is-auth"],
    //   },
    // },
  ],
};
