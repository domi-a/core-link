import { IocContainer } from '@tsoa/runtime';

type Constructor<T> = new (...args: any[]) => T;

class Container implements IocContainer {
  private dependencies: Map<string, any> = new Map();
  private instances: Map<string, any> = new Map();

  register<T>(wtf: any, dependency: Constructor<T> | (() => T)): void {
    const name = wtf.name;
    if (typeof dependency === 'function' && dependency.prototype) {
      this.dependencies.set(name, dependency);
    } else if (typeof dependency === 'function') {
      this.dependencies.set(name, dependency);
    } else {
      throw new Error(
        `Invalid dependency for ${name}. Must be a class or a factory function.`,
      );
    }
  }

  get<T>(wtf: any): T {
    const name = wtf.name;
    if (this.instances.has(name)) {
      return this.instances.get(name);
    }

    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency '${name}' not found.`);
    }

    let instance: T;
    if (typeof dependency === 'function' && dependency.prototype) {
      instance = new dependency();
    } else if (typeof dependency === 'function') {
      instance = dependency();
    } else {
      throw new Error(`Cannot resolve dependency '${name}'.`);
    }

    this.instances.set(name, instance);
    return instance;
  }
}

export const iocContainer = new Container();
