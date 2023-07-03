/**
 * is-super-admin policy
 */

export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user?.role === undefined) {
    return false;
  }
  if (policyContext.state.user.role.name === "SuperAdmin") {
    return true;
  }

  return false;
};
