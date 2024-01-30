/**
 * student controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::student.student",
  ({ strapi }) => ({
    //Find  and Search Students
    async find(ctx) {
      try {
        const { grade, name } = ctx.request.query;
        const params: { grade?: string; [key: string]: any } = {};
        if (grade) params.grade = grade;
        if (name) params.name = name;

        const students = await strapi
          .service("api::student.student")
          .findStudents(params);
        ctx.body = students;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Fine One
    async findOne(ctx) {
      const { id } = ctx.params;
      try {
        const student = await strapi
          .service("api::student.student")
          .findStudent(id);
        if (!student) throw Error(`Student not found!`);
        ctx.body = student;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Create
    async create(ctx) {
      const { name, studentId, grade, gender, academicYear } = ctx.request.body;
      try {
        if (!name) {
          throw Error("Student name is required!");
        }
        if (!studentId) {
          throw Error("StudentID is required!");
        }
        if (!grade) {
          throw Error("Grade is Required!");
        }
        if (!gender) {
          throw Error("Gender is Required!");
        }
        if (!academicYear) {
          throw Error("Academic Year is required!");
        }

        const student = await strapi.db.query("api::student.student").findOne({
          where: { studentId, academicYear: { isActiveYear: true } },
          populate: ["academicYear"],
        });
        if (student && academicYear === student.academicYear.id) {
          throw Error("StudentID is already exist!");
        }
        ctx.body = await strapi
          .service("api::student.student")
          .createStudent(ctx.request.body);
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Create
    async update(ctx) {
      const { id } = ctx.params;
      const { name, studentId, grade, academicYear } = ctx.request.body;
      try {
        if (!name) {
          throw Error("Student name is required!");
        }
        if (!studentId) {
          throw Error("StudentID is required!");
        }
        if (!grade) {
          throw Error("Grade is Required!");
        }
        if (!academicYear) {
          throw Error("Academic Year is required!");
        }

        const isStudent = await strapi.db
          .query("api::student.student")
          .findOne({
            where: { id },
          });

        if (!isStudent) {
          throw Error(`Student not found!`);
        }

        const student = await strapi.db.query("api::student.student").findOne({
          where: {
            studentId,
            id: {
              $ne: id,
            },
            academicYear: { isActiveYear: true },
          },
          populate: ["academicYear"],
        });
        if (student && academicYear === student.academicYear.id) {
          throw Error("StudentID is already exist!");
        }

        const updatedStudent = await strapi
          .service("api::student.student")
          .updateStudent(id, ctx.request.body);
        if (!updatedStudent) throw Error(`Student not found!`);
        ctx.body = updatedStudent;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Delete
    async delete(ctx) {
      const { id } = ctx.params;
      try {
        const student = await strapi.db.query("api::student.student").findOne({
          where: { id },
        });
        if (!student) {
          throw Error("Student not found!");
        }
        ctx.body = await strapi
          .service("api::student.student")
          .deleteStudent(ctx.request.body);
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },
  })
);
