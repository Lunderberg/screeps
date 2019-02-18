function walls(room) {
    if(room.memory.hasOwnProperty('wall_locations')) {
        var wall_locations = room.memory.wall_locations;
    } else {
        var wall_locations = determine_wall_locations(room);
        room.memory.wall_locations = wall_locations;
    }

    wall_locations.forEach( (pos) => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
    });
}

function determine_wall_locations(room) {
    // 2 is minimum tiles from exit that wall can be
    var tiles_from_wall = 2;

    var terrain = room.getTerrain();


    var wall_pos = [];
    function wall_if_empty(x,y) {
        if(terrain.get(x,y) !== TERRAIN_MASK_WALL) {
            wall_pos.push({x: x, y: y});
        }
    }

    var room_exits = [];
    function exit_if_empty(x,y) {
        if(terrain.get(x,y) !== TERRAIN_MASK_WALL) {
            room_exits.push({x: x, y: y});
        }
    }

    for(let i=2; i<48; i++) {
        wall_if_empty(i, tiles_from_wall);
        wall_if_empty(i, 49-tiles_from_wall);
        wall_if_empty(tiles_from_wall, i);
        wall_if_empty(49-tiles_from_wall, i);

        exit_if_empty(i, 0);
        exit_if_empty(i, 49);
        exit_if_empty(0, i);
        exit_if_empty(49, i);
    }

    wall_pos = breadth_first_search(terrain, room_exits, wall_pos);
    wall_pos = breadth_first_search(terrain, [room.controller.pos], wall_pos);

    return wall_pos;
}

// Returns a list of all target tiles that can be reached from the
// source tiles.  Assumes that target tiles are not passable.
function breadth_first_search(terrain, source_tiles, target_tiles) {
    var target = Array(50*50).fill(null).map( i => false);
    target_tiles.forEach(pos => {
        target[50*pos.x + pos.y] = true;
    });

    var visited = Array(50*50).fill(null).map( i => false);

    var queue = Object.values(source_tiles);
    queue.forEach(pos => {
        visited[50*pos.x + pos.y] = true;
    });

    while(queue.length) {
        var node = queue.shift();

        // If node is one of the target tiles, cannot walk through it.
        var node_is_target = target[50*node.x + node.y];
        if(node_is_target) {
            continue;
        }

        var new_nodes =
            [{x: node.x+1, y: node.y+1},
             {x: node.x+0, y: node.y+1},
             {x: node.x-1, y: node.y+1},
             {x: node.x+1, y: node.y+0},
             {x: node.x-1, y: node.y+0},
             {x: node.x+1, y: node.y-1},
             {x: node.x+0, y: node.y-1},
             {x: node.x-1, y: node.y-1},
            ]
        // Keep only valid positions
            .filter( (pos) => {
                return (pos.x >= 0 &&
                        pos.x < 50 &&
                        pos.y >= 0 &&
                        pos.y < 50);
            })
        // Keep only tiles without terrain
            .filter( (pos) => {
                return terrain.get(pos.x,pos.y) !== TERRAIN_MASK_WALL;
            })
        // Keep only positions that haven't been visited yet.
            .filter( (pos) => {
                return !visited[50*pos.x + pos.y];
            });

        new_nodes.forEach( (pos) => {
            visited[50*pos.x + pos.y] = true;
        });

        queue.push(...new_nodes);
    }

    return target_tiles.filter( (pos) => {
        return visited[50*pos.x + pos.y];
    });
}

module.exports = {
    walls: walls,
};
