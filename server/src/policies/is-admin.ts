/**
 * is-admin policy
 */

export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user?.role === undefined) {
    return false;
  }
  if (
    policyContext.state.user.role.name === "SuperAdmin" ||
    policyContext.state.user.role.name === "Admin"
  ) {
    return true;
  }

  return false;
};
