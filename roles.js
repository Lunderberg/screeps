var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleDefender = require('role.defender');
var roleDrone = require('role.drone');

module.exports = {
    harvester: roleHarvester,
    upgrader: roleUpgrader,
    builder: roleBuilder,
    miner: roleMiner,
    defender: roleDefender,
    drone: roleDrone,
};
