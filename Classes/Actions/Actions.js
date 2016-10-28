
function BaseAction() {
    this.run = function(obj, data) {
    }
}

function DestroyAction() {
    this.run = DestroyAction.run;
}

DestroyAction.run = function(obj, data) {
	obj.destroyed = true;
}

function ShootAction(type) {
	this.prefab = null;
	this.force = 0;
    this.forceY = 0;
    this.destroyMs = 0;
    this.run = function(obj, data) {
    	ShootAction.shoot(obj, data, this.prefab, this.force, this.forceY, this.destroyMs);
	}
}

function ShootTwoWayAction(type) {
    this.prefab = null;
    this.force = 0;
    this.forceY = 0;
    this.destroyMs = 0;
    this.run = function(obj, data) {
        ShootAction.shoot(obj, data, this.prefab, this.force, this.forceY, this.destroyMs);
        var newObj = ShootAction.shoot(obj, data, this.prefab, this.force, this.forceY, this.destroyMs);
        newObj.velX = -newObj.velX;
    }
}

ShootAction.shoot = function(obj, data, prefab, force, forceY, destroyMs) {
    var newObj = Entity.createObject(prefab, obj.x, obj.y + obj.h * 0.5, obj.z);
    newObj.creator = obj;
    newObj.layer = obj.layer;
    var dirX = obj.dirX;
    var dirY = obj.dirY;
    var dirZ = obj.dirZ;
    var val = 1;

    if (data) {
        if (data.dir) {
            dirX = data.dir.x;
            dirY = data.dir.y;
            dirZ = data.dir.z;
        }
        if (data.value) {
            force = data.value;
        }
    }

    if (force != 0) {
        newObj.velX = dirX * force;
        newObj.velY = dirY * force + forceY;
        newObj.velZ = dirZ * force;            
    }

    if (destroyMs > 0) {
        setTimeout(function() {
            newObj.destroyed = true;
        }, destroyMs);
    }
    return newObj;
}

function ForceAction(type) {
    this.force = 0;
    this.forceY = 0;
    this.mustBeAtRest = false
    this.run = function(obj, data) {
        if (this.mustBeAtRest && Math.abs(obj.velY) > 0.1 && !obj.justCollided) {
            return;
        }

        var dirX = obj.dirX;
        var dirY = obj.dirY;
        var dirZ = obj.dirZ;

        if (data) {
            if (data.dir) {
                dirX = data.dir.x;
                dirY = data.dir.y;
                dirZ = data.dir.z;
            }
            if (data.value) {
                obj.velX = dirX * data.value;
                obj.velY = dirY * data.value;
                obj.velZ = dirZ * data.value;
            }
        }

        if (this.force != 0) {
            obj.velX = this.force * (dirX * this.force);
            obj.velY = this.force * (dirY * this.force + this.forceY);
            obj.velZ = this.force * (dirZ * this.force);
        }
    }
}

