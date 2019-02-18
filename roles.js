var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');

module.exports = {
    harvester: roleHarvester,
    upgrader: roleUpgrader,
    builder: roleBuilder,
    miner: roleMiner,
};
