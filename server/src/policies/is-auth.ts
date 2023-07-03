/**
 * is-auth policy
 */

export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user?.role === undefined) {
    return false;
  }
  if (
    policyContext.state.user.role.name === "SuperAdmin" ||
    policyContext.state.user.role.name === "Admin" ||
    policyContext.state.user.role.name === "Teacher"
  ) {
    return true;
  }

  return false;
};
