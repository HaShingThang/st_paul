/**
 * student service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::student.student",
  ({ strapi }) => ({
    //Find and Search Students
    async findStudents(params) {
      if (Object.keys(params).length !== 0) {
        const where: any = {};
        if (params.grade) {
          if (params.grade == "All") {
            where.academicYear = { isActiveYear: true };
          } else {
            where.academicYear = { isActiveYear: true };
            where.grade = { grade: params.grade };
          }
        }

        let students = await strapi.db.query("api::student.student").findMany({
          where,
          orderBy: { grade: { id: "asc" }, studentId: "asc" },
          populate: [
            "grade",
            "academicYear",
            "mark",
            "guardianInfo",
            "attendance",
          ],
        });
        if (params.name) {
          const name = params.name;
          const searchStudentName = name.replace(/\s+/g, "").toLowerCase();
          students = students.filter((student) =>
            student.name
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(searchStudentName)
          );
        }
        return students;
      } else {
        return await strapi.db.query("api::student.student").findMany({
          where: {
            academicYear: { isActiveYear: true },
          },
          populate: [
            "grade",
            "academicYear",
            "mark",
            "guardianInfo",
            "attendance",
          ],
          orderBy: { grade: { id: "asc" }, studentId: "asc" },
        });
      }
    },

    /// Get
    async findStudent(id) {
      return await strapi.db.query("api::student.student").findOne({
        where: { id },
        populate: [
          "grade",
          "academicYear",
          "mark",
          "guardianInfo",
          "attendance",
        ],
      });
    },

    /// Create
    async createStudent(student) {
      return await strapi.entityService.create("api::student.student", {
        data: {
          name: student.name,
          studentId: student.studentId,
          grade: student.grade,
          gender: student.gender,
          academicYear: student.academicYear,
          address: student.address,
          guardianInfo: student.guardianInfo,
          publishedAt: new Date(),
        },
        populate: ["grade", "academicYear", "guardianInfo"],
      });
    },

    /// Update
    async updateStudent(id, student) {
      return await strapi.entityService.update("api::student.student", id, {
        data: {
          ...student,
          updatedAt: new Date(),
        },
        populate: ["grade", "academicYear", "guardianInfo"],
      });
    },

    /// Delete
    async deleteStudent(id) {
      const deletedStudent = await strapi.query("api::student.student").delete({
        where: { id },
        populate: ["guardianInfo"],
      });
      return {
        message: `${deletedStudent.name} has been successfully deleted.`,
      };
    },
  })
);
