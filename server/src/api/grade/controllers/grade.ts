/**
 * grade controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::grade.grade",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const params: { grade?: string; [key: string]: any } = {};
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
    async create(ctx) {
      const { grade } = ctx.request.body;
      try {
        if (!grade) {
          throw Error("Grade is required!");
        }
        const existingGrade = await strapi.query("api::grade.grade").findOne({
          where: { grade },
        });
        if (existingGrade) {
          throw new Error(`${grade} is already exist!`);
        }
        ctx.body = await strapi
          .service("api::grade.grade")
          .createGrade(ctx.request.body);
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },
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
