var spawning = require('spawning');

Array.prototype.flat = function() {
    return [].concat(...this);
};

Array.prototype.key_sort = function(key) {
    var output = this
        .map( (item,i,arr) => [key(item,i,arr), item] )
        .sort( (a,b) => {
            if(a[0] < b[0]) { return -1; }
            if(b[0] < a[0]) { return +1; }
            return 0;
        })
        .map( tagged_item => tagged_item[1] );

    // Replaces input array with sorted output
    this.splice(0, this.length, ...output);
    return output;
};



function basic_workers() {
    var spawn_configs = [
        {role: 'harvester',
         name: 'Harvester',
         body: [MOVE, CARRY, WORK],
         min_number: 4},

        {role: 'upgrader',
         name: 'Upgrader',
         body: [MOVE, CARRY, WORK],
         min_number: 2},

        {role: 'builder',
         name: 'Builder',
         body: [MOVE, CARRY, WORK],
         min_number: 4},
    ];

    var num_existing = {};
    spawn_configs.forEach(config => {
        num_existing[config.role] = 0;
    });

    Object.values(Game.creeps)
        .concat(spawning.queue)
        .forEach(creep => {
            if(num_existing[creep.memory.role] !== undefined) {
                num_existing[creep.memory.role]++;
            }
        });

    spawn_configs.forEach(config => {
        for(var i=num_existing[config.role]; i<config.min_number; i++) {
            spawning.queue.push({name: config.name,
                                 body: config.body,
                                 memory: {role: config.role},
                                });
        }
    });
}

function source_mining_locations(source) {
    var terrain = source.room.getTerrain();

    var locs = [{source_id: source.id, x: source.pos.x+1, y: source.pos.y+1},
                {source_id: source.id, x: source.pos.x+0, y: source.pos.y+1},
                {source_id: source.id, x: source.pos.x-1, y: source.pos.y+1},
                {source_id: source.id, x: source.pos.x+1, y: source.pos.y+0},
                {source_id: source.id, x: source.pos.x-1, y: source.pos.y+0},
                {source_id: source.id, x: source.pos.x+1, y: source.pos.y-1},
                {source_id: source.id, x: source.pos.x+0, y: source.pos.y-1},
                {source_id: source.id, x: source.pos.x-1, y: source.pos.y-1},
               ]
        .filter(pos => terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL)
        .key_sort( (pos, i, arr) => {
            return -1 * arr
                .filter( other => (Math.abs(pos.x-other.x)<=1 &&
                                   Math.abs(pos.y-other.y)<=1) )
                .length;
        })
    ;

    locs.forEach( pos => {
        pos.container_x = locs[0].x;
        pos.container_y = locs[0].y;
    });

    return locs;
};

function energy_mining_locations(room) {
    return room.find(FIND_SOURCES)
        .map(source => source_mining_locations(source))
        .flat()
    ;
}


function spawn_miners(room) {

}


function economy() {
    for(var name in Game.rooms) {
        var room = Game.rooms[name];
        var locs = energy_mining_locations(room);
    }
}

module.exports = {
    basic_workers: basic_workers,
    economy: economy,
};
