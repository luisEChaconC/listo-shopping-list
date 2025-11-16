const DOMAIN_DEPENDENCIES = {
  UserRepository: Symbol.for("UserRepository"),
};

const APPLICATION_DEPENDENCIES = {
  SignupService: Symbol.for("SignupService"),
};

const INFRASTRUCTURE_DEPENDENCIES = {
  PostgreSQLUserRepository: Symbol.for("PostgreSQLUserRepository"),
};

const PRESENTATION_DEPENDENCIES = {};

export const DEPENDENCIES = {
  ...DOMAIN_DEPENDENCIES,
  ...APPLICATION_DEPENDENCIES,
  ...INFRASTRUCTURE_DEPENDENCIES,
  ...PRESENTATION_DEPENDENCIES,
};

export type Dependency = (typeof DEPENDENCIES)[keyof typeof DEPENDENCIES];
