/**
 * academic-year router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/academic-year/:id",
      handler: "academic-year.findOne",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "GET",
      path: "/academic-year",
      handler: "academic-year.find",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "POST",
      path: "/academic-year",
      handler: "academic-year.create",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/academic-year/:id",
      handler: "academic-year.update",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
    // {
    //   method: "DELETE",
    //   path: "/academic-year/:id",
    //   handler: "academic-year.delete",
    //   config: {
    //     middlewares: ["global::is-auth"],
    //     policies: ["global::is-auth"],
    //   },
    // },
  ],
};
