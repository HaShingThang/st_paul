/**
 * grade controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::grade.grade",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const { grade } = ctx.request.query;
        const params: { status?: string; [key: string]: any } = {};
        const grades = await strapi
          .service("api::grade.grade")
          .findGrades(params);
        if (!grades.length) throw Error("Grades not yet!");
        ctx.body = grades;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },
    // async findOne(ctx) {
    //   try {
    //   } catch (error) {
    //     ctx.response.status = 404;
    //     ctx.response.body = {
    //       message: error.message,
    //     };
    //   }
    // },
    // async create(ctx) {
    //   try {
    //   } catch (error) {
    //     ctx.response.status = 404;
    //     ctx.response.body = {
    //       message: error.message,
    //     };
    //   }
    // },
    // async update(ctx) {
    //   try {
    //   } catch (error) {
    //     ctx.response.status = 404;
    //     ctx.response.body = {
    //       message: error.message,
    //     };
    //   }
    // },
    // async delete(ctx) {
    //   try {
    //   } catch (error) {
    //     ctx.response.status = 404;
    //     ctx.response.body = {
    //       message: error.message,
    //     };
    //   }
    // },
  })
);
