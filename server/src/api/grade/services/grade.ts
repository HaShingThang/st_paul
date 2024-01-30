/**
 * grade service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::grade.grade",
  ({ strapi }) => ({
    /// Get Grades
    /// Get Grades
    async findGrades(params) {
      if (Object.keys(params).length !== 0) {
        // Handle other cases if needed
      } else {
        const grades = await strapi.db.query("api::grade.grade").findMany({
          populate: ["users", "students"],
        });

        // Custom sorting function for grades with alphanumeric values
        grades.sort((a, b) => {
          const gradeA = a.grade.toLowerCase();
          const gradeB = b.grade.toLowerCase();

          // Extract the numeric part from the grade (e.g., "Grade-1" => 1, "Grade-11" => 11, etc.)
          const numericPartA = parseInt(gradeA.match(/\d+/)?.[0] || "0", 10);
          const numericPartB = parseInt(gradeB.match(/\d+/)?.[0] || "0", 10);

          if (numericPartA < numericPartB) {
            return -1;
          } else if (numericPartA > numericPartB) {
            return 1;
          } else {
            return gradeA.localeCompare(gradeB);
          }
        });

        return grades;
      }
    },

    /// Create Grade
    async createGrade(grade) {
      return strapi.entityService.create("api::grade.grade", {
        data: {
          ...grade,
          publishedAt: new Date(),
        },
      });
    },
  })
);
