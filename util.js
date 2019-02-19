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

Array.prototype.max = function(key) {
    if(key === undefined) {
        key = function(x) { return x; }
    }

    return this
        .slice()
        .key_sort(key)[this.length-1];
};

Array.prototype.min = function(key) {
    if(key === undefined) {
        key = function(x) { return x; }
    }

    return this
        .slice()
        .key_sort(key)[0];
};

Array.prototype.sum = function() {
    return this.reduce( (cumsum, num) => cumsum+num, 0);
};

function creep_cost(body_parts) {
    return body_parts
        .map( part => BODYPART_COST[part])
        .sum();
}

module.exports = {
    creep_cost: creep_cost,
};
