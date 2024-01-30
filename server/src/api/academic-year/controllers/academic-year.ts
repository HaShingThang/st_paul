/**
 * academic-year controller
 */

import { factories } from "@strapi/strapi";
import moment from "moment";

export default factories.createCoreController(
  "api::academic-year.academic-year",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const { startYear, endYear, isActiveYear } = ctx.request.query;
        const params: { status?: string; [key: string]: any } = {};
        const academicYear = await strapi
          .service("api::academic-year.academic-year")
          .findAllAcademicYear(params);
        if (!academicYear.length) throw Error("Academic Year not yet!");
        ctx.body = academicYear;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Get
    async findOne(ctx) {
      try {
        const { id } = ctx.params;
        const academicYear = await strapi
          .service("api::academic-year.academic-year")
          .findAcademicYear(id);
        if (!academicYear) throw Error(`No Academic Year for id: ${id}`);
        ctx.body = academicYear;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },
    async create(ctx) {
      const { startYear, endYear, isActiveYear } = ctx.request.body;
      try {
        if (!startYear) {
          throw Error("Start Year is required!");
        }
        if (!endYear) {
          throw Error("End Year is required!");
        }
        if (typeof isActiveYear !== "boolean") {
          throw Error("Active year format fail!");
        }
        const existingStartYear = await strapi
          .query("api::academic-year.academic-year")
          .findOne({
            where: { startYear: moment(startYear).format("YYYY-MM-DD") },
          });
        if (existingStartYear) {
          throw new Error(
            `${moment(startYear).year()}-${moment(
              endYear
            ).year()} is already exist!`
          );
        }
        const existingActiveYear = await strapi
          .query("api::academic-year.academic-year")
          .findOne({ where: { isActiveYear: true } });

        if (existingActiveYear && isActiveYear) {
          throw new Error("There is already an active academic year!");
        }
        ctx.body = await strapi
          .service("api::academic-year.academic-year")
          .createAcademicYear(ctx.request.body);
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },
    /// Update
    async update(ctx) {
      const { id } = ctx.params;
      const { isActiveYear } = ctx.request.body;
      try {
        const existingAcademicYear = await strapi
          .query("api::academic-year.academic-year")
          .findOne({ id });
        if (!existingAcademicYear)
          throw Error(`Academic Year with id ${id} not found.`);

        const existingActiveYear = await strapi
          .query("api::academic-year.academic-year")
          .findOne({ where: { isActiveYear: true } });
        if (existingActiveYear && isActiveYear) {
          throw new Error("There is already an active academic year!");
        }
        const updatedAcademicYear = await strapi
          .service("api::academic-year.academic-year")
          .updateAcademicYear(id, isActiveYear);
        ctx.body = updatedAcademicYear;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Delete
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
