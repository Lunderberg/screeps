var roles = require('roles');
var spawning = require('spawning');
var room_planner = require('room_planner');
var economy = require('economy');
var visuals = require('visuals');

function clear_dead_memory() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function self_destruct() {
    Object.values(Game.creeps)
        .forEach(creep => creep.suicide());

    Object.values(Game.spawns)
        .forEach(spawn => spawn.destroy());
}

function clear_walls() {
    var walls = Object.values(Game.spawns)
        .map(s => s.room.find(FIND_STRUCTURES))
        .flat()
        .filter(s => s.structureType === STRUCTURE_WALL)
        .forEach(s => s.destroy())
    ;
}

module.exports.loop = function() {
    clear_dead_memory();

    var room = Game.spawns['Spawn1'].room;
    room_planner.place_sites(room);
    visuals.census(room);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roles[creep.memory.role].run(creep);
    }

    spawning.clear_queue();
    economy.basic_workers();
    economy.queue_spawn_miners();
    spawning.do_spawn();
};
