

var roleMiner = {
    run: function(creep) {
        // Choose a site and claim it
        if(creep.memory.miner_loc === undefined) {
            var available = creep.room.memory.miner_locations
                .filter(loc => !Game.creeps[loc.miner_assigned])
            var chosen_loc = available[0];
            chosen_loc.miner_assigned = creep.id;
            creep.memory.miner_loc = chosen_loc;
        }



        // Go to mining site
        var loc = creep.memory.miner_loc;
        var is_at_mine = (creep.pos.x === loc.x && creep.pos.y === loc.y);


        if(!is_at_mine) {
            creep.moveTo(loc.x, loc.y, {visualizePathStyle: {}});
        }

        // If there is a blueprint placed for a container
        var container_blueprint = creep.room.find(
            FIND_CONSTRUCTION_SITES,
            {filter: site => (site.structureType === STRUCTURE_CONTAINER &&
                              site.pos.x === loc.container_x &&
                              site.pos.y === loc.container_y) } );
        if(container_blueprint.length) {
            creep.build(container_blueprint[0]);
        }

        var source = Game.getObjectById(creep.memory.source_id);
        creep.harvest(source);



        var container = creep.room.find(
            FIND_STRUCTURES,
            {filter: struct => (struct.structureType === STRUCTURE_CONTAINER &&
                                struct.pos.x === loc.container_x &&
                                struct.pos.y === loc.container_y) },
        );
    },
}

module.exports = roleMiner;
