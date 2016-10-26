
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
    	var newObj = Entity.createObject(this.prefab, obj.x, obj.y + obj.h * 0.5, obj.z);
    	newObj.creator = obj;
    	newObj.layer = obj.layer;
        newObj.dirX = obj.dirX;
        newObj.dirY = obj.dirY;
        newObj.dirZ = obj.dirZ;
        if (this.force != 0) {
            newObj.velX = newObj.dirX * this.force;
            newObj.velY = newObj.dirY * this.force + this.forceY;
            newObj.velZ = newObj.dirZ * this.force;            
        }

        if (data) {
            if (data.dir) {
                newObj.dirX = data.dir.x;
                newObj.dirY = data.dir.y;
                newObj.dirZ = data.dir.z;
            }
            if (data.value) {
                newObj.velX = newObj.dirX * data.value;
                newObj.velY = newObj.dirY * data.value;
                newObj.velZ = newObj.dirZ * data.value;
            }
        }

        if (this.destroyMs > 0) {
            setTimeout(function() {
                newObj.destroyed = true;
            }, this.destroyMs);
        }
	}
}

