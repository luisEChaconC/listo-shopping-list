import { Container } from "inversify";
import { SignupService } from "../application/signup-service.js";
import { PostgreSQLUserRepository } from "../infrastructure/postgresql-user-repository.js";
import { DEPENDENCIES } from "./dependencies.js";
import type { UserRepository } from "../domain/user.js";

export function registerDependencies(container: Container) {
  registerDomainDependencies(container);
  registerApplicationDependencies(container);
  registerInfrastructureDependencies(container);
  registerPresentationDependencies(container);
}

function registerDomainDependencies(container: Container) { }

function registerApplicationDependencies(container: Container) {
  container.bind(DEPENDENCIES.SignupService).toDynamicValue(ctx => {
    // Use ctx.get for Inversify ResolutionContext
    const userRepo = ctx.get(DEPENDENCIES.UserRepository) as UserRepository;
    return new SignupService(userRepo);
  });
}

function registerInfrastructureDependencies(container: Container) {
  container.bind(DEPENDENCIES.UserRepository).to(PostgreSQLUserRepository);
}

function registerPresentationDependencies(container: Container) { }
