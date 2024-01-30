/**
 * exam router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/exams/:id",
      handler: "exam.findOne",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "GET",
      path: "/exams",
      handler: "exam.find",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "POST",
      path: "/exams",
      handler: "exam.create",
      config: {
        middlewares: ["global::is-admin"],
        policies: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/exams/:id",
      handler: "exam.update",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
    {
      method: "DELETE",
      path: "/exams/:id",
      handler: "exam.delete",
      config: {
        middlewares: ["global::is-auth"],
        policies: ["global::is-auth"],
      },
    },
  ],
};
