/**
 * `is-admin` middleware
 */

import { Strapi } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    if (
      (ctx.state.user && ctx.state.user.role.name === "SuperAdmin") ||
      (ctx.state.user && ctx.state.user.role.name === "Admin")
    ) {
      await next();
    } else {
      ctx.unauthorized("you are unauthenticated.");
    }
  };
};
