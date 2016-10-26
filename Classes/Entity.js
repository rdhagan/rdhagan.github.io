
function Entity(obj, name) {
    this.name = name === undefined ? null : name;
    this.x = this.y = this.z = 0;
    this.previousX = this.previousY = this.previousZ = 0;
    this.w = this.h = this.d = SCALE;
    this.moved = false;
    this.obj = obj;
    this.agent = null;
    this.player = null;
    this.creator = null;
    this.layer = 0;
    this.destroyOnHitGround = false;
    this.destroyed = false;
    this.offsetY = 0;
    if (obj) {
        obj.entity = this;
    }
    this.dirX = this.dirY = this.dirZ = 0;
    this.velX = this.velY = this.velZ = 0;
    this.accX = this.accZ = 0;
    this.accY = -2 * SCALE;
    this.moving = true;
    this.collideHandlers = [];  // function (ent1, ent2)

    this.setObject = function(obj) {
        this.obj = obj;
        obj.entity = this;
        this.updateObjectPos();
    }
    this.setPosition = function(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z;
    }
    this.updateObjectPos = function(pos) {
        if (this.obj) {
            this.obj.position.x = this.x;
            this.obj.position.y = this.y;
            this.obj.position.z = this.z;
        }
    }
    this.doesCollide = function(other) {
        return this != other && ((this.layer & other.layer) == 0) &&
            this.intersects(other) && !this.wasIntersecting(other);
    }
    this.wasIntersecting = function(other) {
        return other.previousX <= this.previousX + this.w && other.previousX + other.w >= this.previousX &&
            other.previousY <= this.previousY + this.h && other.previousY + other.h >= this.previousY &&
            other.previousZ <= this.previousZ + this.d && other.previousZ + other.d >= this.previousZ;
    }
    this.intersects = function(other) {
    	return other.x <= this.x + this.w && other.x + other.w >= this.x &&
    		other.y <= this.y + this.h && other.y + other.h >= this.y &&
    		other.z <= this.z + this.d && other.z + other.d >= this.z;
    }
    this.clone = function() {
        // TODO: shallow copy
        var newObj = null;
        if (this.obj != null) {
            newObj = this.obj.clone();
        }

        var ent = new Entity(newObj);
        // for (var key in this) {
        //     if (typeof v !== "function") {
        //         ent[key] = this[key];
        //     }
        // }
        ent.name = this.name;
        ent.w = this.w;
        ent.h = this.h;
        ent.d = this.d;
        ent.offsetY = this.offsetY;
        ent.agent = this.agent == null ? null : this.agent.clone();
        ent.layer = this.layer;
        ent.destroyOnHitGround = this.destroyOnHitGround;
        ent.dirX = this.dirX;
        ent.dirY = this.dirY;
        ent.dirZ = this.dirZ;
        ent.velX = this.velX;
        ent.velY = this.velY;
        ent.velZ = this.velZ;
        ent.accX = this.accX;
        ent.accY = this.accY;
        ent.accZ = this.accZ;
        ent.obj = newObj;
        newObj.entity = ent;
        ent.collideHandlers = this.collideHandlers.slice(0);

        return ent;
    }
    this.handleCollision = function(other) {
    	this.x = this.previousX;
    	this.y = this.previousY;
    	this.z = this.previousZ;
    	other.x = other.previousX;
    	other.y = other.previousY;
    	other.z = other.previousZ;    	
//        this.velX = this.velY = this.velZ = 0;
//        other.velX = other.velY = other.velZ = 0;
    	for (var collide in this.collideHandlers) {
    		this.collideHandlers[collide](this, other);
    	}
	}
    this.update = function(dt) {
        this.previousX = this.x;
        this.previousY = this.y;
        this.previousZ = this.z;

        if (this.moving) {
    		this.velX += this.accX * dt;
    		this.velY += this.accY * dt;
    		this.velZ += this.accZ * dt;			
    		this.x += this.velX * dt;
    		this.y += this.velY * dt;
    		this.z += this.velZ * dt;
    		if (this.velX != 0 || this.velY != 0 || this.velZ != 0) {
    			this.moved = true;
    		} else {
    			this.moved = false;
    		}
            if (this.y < 0) {
                this.y = 0;
                this.velY = 0;
                if (this.destroyOnHitGround) {
                    this.destroyed = true;
                }
            }
    	}
    	if (obj != null) {
    		obj.position.x = this.x;
    		obj.position.y = this.y + this.offsetY;
    		obj.position.z = this.z;
    	}
    }
}

Entity.destroyOnCollide = function(ent1, ent2) {
    ent1.destroyed = true;
}

Entity.damageOnCollide = function(ent1, ent2) {
    if (ent2.player != null) {
        ent2.player.dealDamage(4); // TODO
    }
}

Entity.createEntity = function(obj, x, y, z) {
    var ent = new Entity(obj);
    ent.x = x === undefined ? 0 : x;
    ent.y = y === undefined ? 0 : y;
    ent.z = z === undefined ? 0 : z;
    entityScene.addEntity(obj);
    return ent;
}

Entity.createObject = function(prefab, x, y, z, obj) {
    //      var newObj = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    var newObj = null;
    var ent = null;

    if (prefab == null) {
        if (obj) {
            newObj = obj; //.clone();
        } else {
            var material = new THREE.MeshBasicMaterial();
            newObj = new THREE.Mesh( new THREE.SphereGeometry( 0.5, 20, 10 ), material );
        }
        ent = new Entity(newObj);
    } else {
        ent = prefab.clone();
        newObj = ent.obj;
    }
    newObj.entity = ent;

    if (newObj && newObj.parent == null) {
        scene.add( newObj );
    }
    ent.x = x === undefined ? 0 : x;
    ent.y = y === undefined ? 0 : y;
    ent.z = z === undefined ? 0 : z;
    entityScene.addEntity(ent);
    ent.updateObjectPos();
    return ent;
}

Entity.createCombatAgent = function(prefab, x, y, z, obj, autoShooting, force, forceY) {
    var ent = Entity.createObject(prefab, x, y, z, obj);
    ent.name = "CombatAgent";
    ent.player = new Player(ent);
    var agent = ent.agent = new CombatAgent(ent);
    
    // shot
    var shootAction = new ShootAction();
    shootAction.force = force ? force : 10;
    shootAction.forceY = forceY ? forceY : 2;
    shootAction.destroyMs = 5000;
    if (autoShooting) {
        agent.action = shootAction;
        agent.actionIntervalMs = 10000;
    } else {
        agent.slingshotAction = shootAction;        
    }
    agent.start();

    var material = new THREE.MeshBasicMaterial();
    var prefabObj = new THREE.Mesh( new THREE.SphereGeometry( 0.25 * SCALE, 20, 10 ), material );
    prefabObj.w = prefabObj.h = prefabObj.d = SCALE;
    var prefab = new Entity(prefabObj);
    prefab.destroyOnHitGround = true;
    prefab.collideHandlers.push(Entity.damageOnCollide);
    prefab.collideHandlers.push(Entity.destroyOnCollide);
    shootAction.prefab = prefab;

    return ent;
}
