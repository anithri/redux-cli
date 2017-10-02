import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';

import getEnvironment from '../../environment';
import Generate from '../../../sub-commands/generate';
import buildBlueprintCommand from './build-blueprint-command';

const environment = getEnvironment();
const subCommand = new Generate(environment);

const { blueprints, settings: { bp = {} } } = environment.settings;

const loadBlueprintSettings = blueprint =>
  (blueprint.settings = _merge(
    _cloneDeep(bp.common),
    _cloneDeep(bp[blueprint.name])
  ));

const buildBlueprintCommands = () =>
  blueprints.generators().map(blueprint => {
    loadBlueprintSettings(blueprint);
    return buildBlueprintCommand(blueprint, subCommand);
  });

export default buildBlueprintCommands;
