import { log } from '../../logger.js';
import * as configApi from '../../config.js';

import {
  setAccTitle,
  getAccTitle,
  getAccDescription,
  setAccDescription,
  clear as commonClear,
  setDiagramTitle,
  getDiagramTitle,
} from '../common/commonDb.js';

let entities = {};
let relationships = [];

const IS_A_IDENTIFIER = "IS_A";

const Cardinality = {
  ZERO_OR_ONE: 'ZERO_OR_ONE',
  ZERO_OR_MORE: 'ZERO_OR_MORE',
  ONE_OR_MORE: 'ONE_OR_MORE',
  ONLY_ONE: 'ONLY_ONE',
  MD_PARENT: 'MD_PARENT',
};

const Identification = {
  NON_IDENTIFYING: 'NON_IDENTIFYING',
  IDENTIFYING: 'IDENTIFYING',
};

const addEntity = function (name, alias = undefined) {
  if (entities[name] === undefined) {
    entities[name] = { attributes: [], alias: alias };
    log.info('Added new entity :', name);
  } else if (entities[name] && !entities[name].alias && alias) {
    entities[name].alias = alias;
    log.info(`Add alias '${alias}' to entity '${name}'`);
  }

  return entities[name];
};

const getEntities = () => entities;

const addAttributes = function (entityName, attribs) {
  let entity = addEntity(entityName); // May do nothing (if entity has already been added)

  // Process attribs in reverse order due to effect of recursive construction (last attribute is first)
  let i;
  for (i = attribs.length - 1; i >= 0; i--) {
    entity.attributes.push(attribs[i]);
    log.debug('Added attribute ', attribs[i].attributeName);
  }
};

/**
 * Add a relationship
 *
 * @param entA The first entity in the relationship
 * @param rolA The role played by the first entity in relation to the second
 * @param entB The second entity in the relationship
 * @param rolB The role played by the second entity in relation to the first
 * @param rSpec The details of the relationship between the two entities
 */
const addRelationship = function (entA, rolA, entB, rolB, rSpec) {
  let rel = {
    entityA: entA,
    roleA: rolA,
    entityB: entB,
    roleB: rolB,
    relSpec: rSpec,
  };

  relationships.push(rel);
  log.debug('Added new relationship :', rel);
};

/**
 * Add a relationship
 *
 * @param entA The first entity in the relationship
 * @param entB The second entity in the relationship
 */
const addIsARelationship = function (entA, entB) {
  let rel = {
    entityA: entA,
    entityB: entB,
    relSpec: IS_A_IDENTIFIER
  };

  relationships.push(rel);
  log.debug('Added new relationship :', rel);
};

const getRelationships = () => relationships;

const clear = function () {
  entities = {};
  relationships = [];
  commonClear();
};

export default {
  Cardinality,
  Identification,
  getConfig: () => configApi.getConfig().er,
  addEntity,
  addAttributes,
  getEntities,
  addRelationship,
  addIsARelationship,
  getRelationships,
  clear,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,
  setDiagramTitle,
  getDiagramTitle,
  IS_A_IDENTIFIER,
};
