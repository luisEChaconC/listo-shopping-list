import { Container } from "inversify";

export function registerDependencies(container: Container) {
  registerDomainDependencies(container);
  registerApplicationDependencies(container);
  registerInfrastructureDependencies(container);
  registerPresentationDependencies(container);
}

function registerDomainDependencies(container: Container) {}

function registerApplicationDependencies(container: Container) {}

function registerInfrastructureDependencies(container: Container) {}

function registerPresentationDependencies(container: Container) {}
