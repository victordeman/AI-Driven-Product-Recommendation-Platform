import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

const uri = process.env.NEO4J_URI!;
const user = process.env.NEO4J_USERNAME!;
const password = process.env.NEO4J_PASSWORD!;

export const getNeo4jDriver = () => {
  if (!driver) {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 50,
      connectionTimeout: 30000,
    });
  }
  return driver;
};
