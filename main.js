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

module.exports.loop = function() {
    clear_dead_memory();

    var room = Game.spawns['Spawn1'].room;
    room_planner.plan_room(room);
    room_planner.apply_plan(room);
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
