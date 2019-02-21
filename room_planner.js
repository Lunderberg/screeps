var walls = require('room_planner.walls');
var mining = require('room_planner.mining');
var roads = require('room_planner.roads');

function plan_room(room) {
    if(room.memory.plan === undefined) {
        room.memory.plan = {};
    }
    var room_plan = room.memory.plan;


    if(room_plan.walls === undefined) {
        room_plan.walls = walls.choose_wall_locations(room);
    }

    if(room_plan.energy_mining_spots === undefined) {
        room_plan.energy_mining_spots = mining.choose_energy_mining_spots(room);
    }
}


function apply_plan(room) {
    if(room.memory.plan === undefined) {
        plan_room(room);
    }

    var room_plan = room.memory.plan;

    room_plan.walls.forEach( (pos) => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
    });

    room_plan.energy_mining_spots
        .filter( pos => (pos.type==='primary') )
        .forEach( (pos) => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
        });
}


module.exports = {
    plan_room: plan_room,
    apply_plan: apply_plan,
};
