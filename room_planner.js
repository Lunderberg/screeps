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

    if(room_plan.roads === undefined) {
        room_plan.roads = plan_roads(room);
    }

    if(room_plan.extensions === undefined) {
        var res = plan_extensions(room, room_plan.roads);
        room_plan.extensions = res.extensions;
        room_plan.roads.extend(res.roads);
    }
}

function plan_roads(room) {
    var output = [];

    // Road from spawn to each energy source
    var spawns = room.find(FIND_MY_SPAWNS);
    var sources = room.find(FIND_SOURCES);
    spawns.map(spawn => sources.map(source => {
        output.extend(spawn.pos.findPathTo(source.pos));
    }));

    return output;
}

function plan_extensions(room, roads) {
    var spawn = room.find(FIND_MY_SPAWNS);
    if(spawn.length===0) {
        return [];
    }
    spawn = spawn[0];




    var extensions = [];
    var new_roads = [];

    var square_side = 2;
    var top_left = {x: spawn.pos.x,
                    y: spawn.pos.y};

    var forbidden_positions = [spawn.pos];
    forbidden_positions.extend(roads);

    var terrain = room.getTerrain();
    for(var x=0; x<50; x++) {
        for(var y=0; y<50; y++) {
            if(terrain.get(x,y)===TERRAIN_MASK_WALL) {
                forbidden_positions.push({x:x, y:y});
            }
        }
    }

    while(extensions.length < 60) {
        var new_ring = (
            // An NxN array
            Array(square_side).fill(null)
                .map( (_,i) => Array(square_side).fill(null)
                      .map( (_,j) => {return {x: top_left.x+i,
                                              y:top_left.y+j};}))

                .flat()

            // Keeping only the outermost ring
                .filter(pos => ( (pos.x-top_left.x == 0) ||
                                 (pos.x-top_left.x == square_side-1) ||
                                 (pos.y-top_left.y == 0) ||
                                 (pos.y-top_left.y == square_side-1) ))

            // Excluding any forbidden positions
                .filter(pos => forbidden_positions.every(fpos => fpos.x!==pos.x || fpos.y!==pos.y) )
        );

        // Every third row are roads
        var arr = extensions;
        if(square_side%6 == 4) {
            arr = new_roads;
        }
        arr.extend(new_ring);

        square_side += 2;
        top_left.x -= 1;
        top_left.y -= 1;

        if(square_side > 50) {
            break;
        }
    }

    return {extensions: extensions,
            roads: new_roads,
           };
}

function place_sites(room) {
    plan_room(room);

    var room_plan = room.memory.plan;

    room_plan.walls.forEach( (pos) => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
    });

    room_plan.energy_mining_spots
        .filter( pos => (pos.type==='primary') )
        .forEach( (pos) => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
        });

    room_plan.roads.forEach( (pos) => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
    });

    room_plan.extensions.forEach( (pos) => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
    });
}


module.exports = {
    plan_room: plan_room,
    place_sites: place_sites,
};
