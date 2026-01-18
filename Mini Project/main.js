

var USE_WIREFRAME = false;
const SHOOT_SFX = 'audio/gun-shot.mp3'
const ENEMY_DIED_SFX = 'audio/died1.wav'
const RELOAD_SFX = 'audio/gun_small_reload.wav'
const HEALING = 'audio/healing.wav'
const HURT_SFX = 'audio/male_hurt9.ogg'
const GAME_LOSE = 'audio/game-die.mp3'
const GAME_WIN = 'audio/game-win.wav'

const BGM = 'audio/action-bgm.mp3'


const Story_level_1 = ["You awaken in Sector 12. The infection has spread. Escape is your only option...",
                        "Retreat to Exit Point, Eliminate every monster around with your.",
                        "Keep Save."
];
const Story_level_2 = ["You are near to the town, Even here also full with those monster.", 
                        "Take the supplies at the table in front of you.", 
                        "Be careful, we are waiting you on town."
]
const Story_level_3 = ["Finally arrived the town, But the monster are much better.", 
                        "We don't have much time, find the 'Key' and Retreat to the Safe Zone!"
]
const Story_end = ["We make it! We are arrived the save zone!",
                    "I think we are safe for now...",
                    "..."
]

   /** Main Game */
class Game {
    constructor(difficulty = 1) {
        this.difficulty = difficulty;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.animationId = null;

        this.gameOver = false;
        this.targetEnemy = 0;
        this.currentEnemy = 0;
        this.level = 1;
        this.haveToKillAll = true;

        this.keyboard = {};
        this.player = new Player();
        this.weapon = null;
        this.weapon_1 = null;
        this.weapon_2 = null;
        this.bullets = [];
        this.box_mesh = null;

        this.exit = null;
        this.healt_box = [];
        this.enemy = [];
        this.key = null;
        this.hasKey = false


        // Object for bullet detect
        this.bullet_collidables = [];
        // Object for Player detect
        this.collidables = [];
        this.reloadCollidebles = [];
        this.weaponCollidebles = [];
        this.doorCollidebles = [];

        // Object
        this.objects = [];
        this.lighting = [];
        this.meshes = {};
        this.models = {
            tent: {
                obj: "materials/Objects/Tent_Poles_01.obj",
                mtl: "materials/Objects/Tent_Poles_01.mtl",
                mesh: null
            },
            // uzi: {
            //     obj: "materials/Objects/uziGold.obj",
            //     mtl: "materials/Objects/uziGold.mtl",
            //     mesh: null,
            //     castShadow: false
            // },
            small_gun: {
                obj: "materials/Gun/small_gun.obj",
                mtl: "materials/Gun/small_gun.mtl",
                mesh: null,
                castShadow: false
            },
            ak47: {
                obj: "materials/Gun/AK-47.obj",
                mtl: "materials/Gun/AK-47.mtl",
                mesh: null,
                castShadow: false
            },
            shotgun: {
                obj: "materials/Gun/shotgun.obj",
                mtl: "materials/Gun/shotgun.mtl",
                mesh: null,
                castShadow: false
            },
            reload: {
                obj: "materials/Gun/ammo.obj",
                mtl: "materials/Gun/ammo.mtl",
                mesh: null
            },
            hp: {
                obj: "materials/Objects/hp.obj",
                mtl: "materials/Objects/hp.mtl",
                mesh: null
            },
            exit: {
                obj: "materials/Objects/exit.obj",
                mtl: "materials/Objects/exit.mtl",
                mesh: null
            },


            pallet_1: {
                obj: "materials/Objects/uploads_files_2535670_pallet.obj",
                mtl: "materials/Objects/uploads_files_2535670_pallet.mtl",
                mesh: null
            },

            // Tree File
            tree_1: {
                obj: "materials/Tree/Tree_1.obj",
                mtl: "materials/Tree/Tree_1.mtl",
                castShadow: true,
                mesh: null
            }, 
            tree_2: {
                obj: "materials/Tree/Tree_2.obj",
                mtl: "materials/Tree/Tree_2.mtl",
                mesh: null
            },
            tree_3: {
                obj: "materials/Tree/Tree_3.obj",
                mtl: "materials/Tree/Tree_3.mtl",
                mesh: null
            },
            stump_1: {
                obj: "materials/Tree/Stump_1.obj",
                mtl: "materials/Tree/Stump_1.mtl",
                mesh: null
            },
            stump_2: {
                obj: "materials/Tree/Stump_2.obj",
                mtl: "materials/Tree/Stump_2.mtl",
                mesh: null
            },
            log_1: {
                obj: "materials/Tree/Log_1.obj",
                mtl: "materials/Tree/Log_1.mtl",
                mesh: null
            },
            log_2: {
                obj: "materials/Tree/Log_2.obj",
                mtl: "materials/Tree/Log_2.mtl",
                mesh: null
            },

            rock_1: {
                obj: "materials/Rock/rock1.obj",
                mtl: "materials/Rock/rock1.mtl",
                mesh: null
            },
            rock_2: {
                obj: "materials/Rock/rock_05.obj",
                mtl: "materials/Rock/rock_05.mtl",
                mesh: null
            },

            bus_1: {
                obj: "materials/Car/bus2.obj",
                mtl: "materials/Car/bus2.mtl",
                mesh: null
            },

            iron_fence: {
                obj: "materials/Objects/iron_fence.obj",
                mtl: "materials/Objects/iron_fence.mtl",
                mesh: null
            },
            key: {
                obj: "materials/Objects/key.obj",
                mtl: "materials/Objects/key.mtl",
                mesh: null
            },


            home_1: {
                obj: "materials/Home/home_1.obj",
                mtl: "materials/Home/home_1.mtl",
                mesh: null
            },
            home_2: {
                obj: "materials/Home/home_2.obj",
                mtl: "materials/Home/home_2.mtl",
                mesh: null
            },

            home_broken: {
                obj: "materials/Home/HomeBroken/home_broken.obj",
                mtl: "materials/Home/HomeBroken/home_broken.mtl",
                mesh: null
            },
            home_broken_1: {
                obj: "materials/Home/HomeBroken/home_broken_1.obj",
                mtl: "materials/Home/HomeBroken/home_broken_1.mtl",
                mesh: null
            },
            home_broken_2: {
                obj: "materials/Home/HomeBroken/home_broken_2.obj",
                mtl: "materials/Home/HomeBroken/home_broken_2.mtl",
                mesh: null
            },
            home_broken_3: {
                obj: "materials/Home/HomeBroken/home_broken_3.obj",
                mtl: "materials/Home/HomeBroken/home_broken_3.mtl",
                mesh: null
            },
            home_broken_4: {
                obj: "materials/Home/HomeBroken/home_broken_4.obj",
                mtl: "materials/Home/HomeBroken/home_broken_4.mtl",
                mesh: null
            },

            building_u: {
                obj: "materials/Home/Building_U/building_u.obj",
                mtl: "materials/Home/Building_U/building_u.mtl",
                mesh: null
            },
            building_u_1: {
                obj: "materials/Home/Building_U/building_u_1.obj",
                mtl: "materials/Home/Building_U/building_u_1.mtl",
                mesh: null
            },
            building_u_2: {
                obj: "materials/Home/Building_U/building_u_2.obj",
                mtl: "materials/Home/Building_U/building_u_2.mtl",
                mesh: null
            },
            building_u_3: {
                obj: "materials/Home/Building_U/building_u_3.obj",
                mtl: "materials/Home/Building_U/building_u_3.mtl",
                mesh: null
            },


            road_1: {
                obj: "materials/Road/uploads_files_2726644_stone_path_low_poly.obj",
                mtl: "materials/Road/uploads_files_2726644_stone_path_low_poly.mtl",
                mesh: null
            },

            game_1: {
                obj: "materials/Game/game1.obj",
                mtl: "materials/Game/game1.mtl",
                mesh: null
            },
            game_2: {
                obj: "materials/Game/game2.obj",
                mtl: "materials/Game/game2.mtl",
                mesh: null
            },
            game_3: {
                obj: "materials/Game/game3.obj",
                mtl: "materials/Game/game3.mtl",
                mesh: null
            },

            enemy_1: {
                obj: "materials/Enemy/Enemy1.obj",
                mtl: "materials/Enemy/Enemy1.mtl",
                mesh: null
            },
        };
        
        this.loadingManager = null;
        this.RESOURCES_LOADED = false;
        this.loadingScreen = new LoadingScreen();

        // Mouse Control 
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.isMouseDown = false;
        this.mouseSensitivity = 0.002;
        this.isPointerLocked = false;
        
        // Fellback event connect
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));

        document.addEventListener('pointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('webkitpointerlockchange', this.handlePointerLockChange.bind(this), false);

    }

    formatWeaponName(rawName) {
        const customNames = {
            ak47: "AK-47"
        };
        if (customNames[rawName.toLowerCase()]) {
            return customNames[rawName.toLowerCase()];
        }

        return rawName
            .toLowerCase()
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    updateHUD() {

        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        document.getElementById("playerHpFill").style.width = `${playerHpPercent}%`;
    
        const enemyCount = this.enemy.length;
        let enemy = "👾 Enemies: " + enemyCount + " / " + this.targetEnemy;
        document.getElementById("enemyCount").textContent = enemy;
    
        this.updateWeaponUI(this.weapon);
    
        const hpContainer = document.getElementById("enemyHpBars");
        if (!hpContainer || !this.camera) return;
    
        hpContainer.innerHTML = ''; // Clear old bars
    
        const width = window.innerWidth;
        const height = window.innerHeight;
    
        for (let e of this.enemy) {
            if (!e || !e.mesh || !e.mesh.position || !e.onChase) continue;
    
            const hpPercent = Math.max(e.hp / e.maxHp, 0);
    
            // Tightly calculate top of head
            const bbox = new THREE.Box3().setFromObject(e.mesh);
            const centerX = (bbox.min.x + bbox.max.x) / 2;
            const centerZ = (bbox.min.z + bbox.max.z) / 2;
            const headY = bbox.max.y;
            const enemyPos = new THREE.Vector3(centerX, headY + 0.05, centerZ);
            enemyPos.project(this.camera);
    
            if (enemyPos.z > 1 || enemyPos.z < -1) continue;
    
            const x = (enemyPos.x * 0.5 + 0.4) * window.innerWidth;
            const y = (-enemyPos.y * 0.6 + 0.6) * window.innerHeight;
    
            const bar = document.createElement('div');
            bar.className = 'enemyHpBar';
            bar.style.left = `${x - 50}px`; // 60px wide
            bar.style.top = `${y}px`;
    
            const fill = document.createElement('div');
            fill.className = 'enemyHpFill';
            fill.style.width = `${hpPercent * 100}%`;
    
            bar.appendChild(fill);
            document.getElementById("enemyHpBars").appendChild(bar);
        }
    }

    updateWeaponUI(currentWeapon) {
        if (this.weapon_1) {
            let icon = "1. "
            let bulletCount = this.weapon_1.currentBullet + " / " + this.weapon_1.maxBullet;

            if (currentWeapon.name == this.weapon_1.name){
                icon = "🔫1. "
                bulletCount = currentWeapon.currentBullet + " / " + currentWeapon.maxBullet;
            }

            document.getElementById("weaponName").textContent = icon + this.formatWeaponName(this.weapon_1.name);

            if (this.weapon_1.totalMaxBulletDefault != -1)
                document.getElementById("ammoCount").textContent = bulletCount + " - " + this.weapon_1.totalMaxBullet;
            else
                document.getElementById("ammoCount").textContent = bulletCount;

        } else {
            document.getElementById("weaponName").textContent = "1. Empty";
            document.getElementById("ammoCount").textContent = "";
        }


        if (this.weapon_2) {
            let icon = "2. "
            let bulletCount = this.weapon_2.currentBullet + " / " + this.weapon_2.maxBullet + " - " + this.weapon_2.totalMaxBullet;

            if (currentWeapon.name == this.weapon_2.name){
                icon = "🔫2. "
                bulletCount = currentWeapon.currentBullet + " / " + currentWeapon.maxBullet + " - " + currentWeapon.totalMaxBullet;
            }

            document.getElementById("weaponName_2").textContent = icon + this.formatWeaponName(this.weapon_2.name);
            document.getElementById("ammoCount_2").textContent = bulletCount;

        } else {
            document.getElementById("weaponName_2").textContent = "2. Empty";
            document.getElementById("ammoCount_2").textContent = "";
        }
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
        this.clock = new THREE.Clock();
        
        this.initLighting()
        this.setupLoadingManager(this.level);
        this.setupSceneObjects(this.level);

        this.loadModel();
        
        this.setupCameraScene();
        this.setupMusicPlayer(BGM, 0.15);

        const canvas = this.renderer.domElement;
        canvas.addEventListener('click', () => {
            canvas.requestPointerLock = canvas.requestPointerLock ||
                                      canvas.mozRequestPointerLock ||
                                      canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
        });
    }


    // Sound Display
    setupMusicPlayer(file, volume=0.5) {
        if (! file) return;

        const listener = new THREE.AudioListener();
        this.camera.add(listener);
    
        const audio = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(file, buffer => {
            audio.setBuffer(buffer);
            audio.setLoop(true);
            audio.setVolume(volume);
            audio.play();
        });
    }
    playSFX(path, volume = 1.0) {
        let sound = new Audio(path);
        sound.volume = volume;
        sound.play();
    }

    // Setup Loading Manager
    setupLoadingManager(level) {
        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onProgress = (item, loaded, total) => 
            console.log(item, loaded, total);
        this.loadingManager.onLoad = () => {
            console.log("Loaded all resources");
            this.RESOURCES_LOADED = true;
            switch (level){
                case 1:
                    this.onResourcesLoadedLevel_1();
                    // Display dialog when the scene is ready
                    showStoryline(Story_level_1);
                    break;
                case 2:
                    this.onResourcesLoadedLevel_2();
                    showStoryline(Story_level_2);
                    break;
                case 3:
                    this.onResourcesLoadedLevel_3();
                    showStoryline(Story_level_3);
                    break;
            }
        };
    }
    loadModel() {
        Object.keys(this.models).forEach(key => {

            const mtlLoader = new THREE.MTLLoader(this.loadingManager);
            mtlLoader.load(this.models[key].mtl, materials => {

                materials.preload();
                const objLoader = new THREE.OBJLoader(this.loadingManager);
                objLoader.setMaterials(materials);
                
                objLoader.load(this.models[key].obj, mesh => {
                    mesh.traverse(node => {
                        if (node instanceof THREE.Mesh) {
                            node.castShadow = 'castShadow' in this.models[key] 
                                ? this.models[key].castShadow 
                                : true;
                            node.receiveShadow = 'receiveShadow' in this.models[key] 
                                ? this.models[key].receiveShadow 
                                : true;
                        }
                    });
                    this.models[key].mesh = mesh;
                });
            });
        });
    }

    removeObject(object3D) {
        if (!(object3D instanceof THREE.Object3D)) return false;
    
        // for better memory management and performance
        if (object3D.geometry) object3D.geometry.dispose();
    
        if (object3D.material) {
            if (object3D.material instanceof Array) {
                // for better memory management and performance
                object3D.material.forEach(material => material.dispose());
            } else {
                // for better memory management and performance
                object3D.material.dispose();
            }
        }
        object3D.removeFromParent();
        return true;
    }

    // ------------------------ World Enviroment Setup -------------------------

    // World Ligting
    initLighting() {
        // Enviroment Lighting
        const ambientLight = new THREE.AmbientLight(0xEEDEFF, 0.7);
        this.scene.add(ambientLight);
    }
    initLightingLevel_1() {

        // Lighting
        let pointLight = new THREE.PointLight(0xA090FF, 0.6, 55);
        pointLight.position.set(-3, 6, 3);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0.1;
        pointLight.shadow.camera.far = 35;
        this.scene.add(pointLight);

        let pointLight2 = new THREE.PointLight(0xA090FF, 0.6, 55);
        pointLight2.position.set(3, 8, 40);
        pointLight2.castShadow = true;
        pointLight2.shadow.camera.near = 0.1;
        pointLight2.shadow.camera.far = 35;
        this.scene.add(pointLight2);


        this.lighting.push(pointLight);
        this.lighting.push(pointLight2);
    }
    initLightingLevel_2() {
        let pointLight = new THREE.PointLight(0xA090FF, 0.7, 60);
        pointLight.position.set(26, 6, 75);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0.1;
        pointLight.shadow.camera.far = 35;
        this.scene.add(pointLight);

        let pointLight2 = new THREE.PointLight(0xA090FF, 0.6, 55);
        pointLight2.position.set(66, 6, 54);
        pointLight2.castShadow = true;
        pointLight2.shadow.camera.near = 0.1;
        pointLight2.shadow.camera.far = 35;
        this.scene.add(pointLight2);

        let pointLight3 = new THREE.PointLight(0xA0A009, 0.4, 45);
        pointLight3.position.set(30, 16, 130);
        pointLight3.castShadow = true;
        pointLight3.shadow.camera.near = 0.1;
        pointLight3.shadow.camera.far = 35;
        this.scene.add(pointLight3);

        this.lighting.push(pointLight);
        this.lighting.push(pointLight2);
        this.lighting.push(pointLight3);

    }
    initLightingLevel_3() {
        let pointLight = new THREE.PointLight(0xA090FF, 0.7, 60);
        pointLight.position.set(49, 6, 130);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0.1;
        pointLight.shadow.camera.far = 35;
        this.scene.add(pointLight);

        let pointLight2 = new THREE.PointLight(0xA090FF, 0.7, 60);
        pointLight2.position.set(124, 6, 136);
        pointLight2.castShadow = true;
        pointLight2.shadow.camera.near = 0.1;
        pointLight2.shadow.camera.far = 35;
        this.scene.add(pointLight2);

        let pointLight3 = new THREE.PointLight(0xA090FF, 0.7, 60);
        pointLight3.position.set(101, 6, 199);
        pointLight3.castShadow = true;
        pointLight3.shadow.camera.near = 0.1;
        pointLight3.shadow.camera.far = 35;
        this.scene.add(pointLight3);

        let pointLight4 = new THREE.PointLight(0xA090FF, 0.7, 60);
        pointLight4.position.set(59, 6, 189);
        pointLight4.castShadow = true;
        pointLight4.shadow.camera.near = 0.1;
        pointLight4.shadow.camera.far = 35;
        this.scene.add(pointLight4);
        
        this.objects.push(pointLight);
        this.objects.push(pointLight2);
        this.objects.push(pointLight3);
        this.objects.push(pointLight4);
    }



    // Camera Setup
    setupCameraScene() {
        this.camera.position.set(0, this.player.height, -5);
        this.camera.lookAt(new THREE.Vector3(0, this.player.height, 0));

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(1200, 800);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.domElement.id = 'gameCanvas';

        // Set the bg color
        this.renderer.setClearColor("#6485DD")

        document.body.appendChild(this.renderer.domElement);
        this.animate();
    }
    




    // ------------------------ Part of Loading and Instantiate Object ---------------------------

    setupSceneObjects(level){
        let target = ""
        switch (level){
            case 1:
                target = "Kill all the monster, go to exit point!"
                this.haveToKillAll = true;
                this.initModelLevel_1();
                this.initLightingLevel_1();
                this.initTextureLevel_1();
                break;
            case 2:
                target = "Kill all the monster, go to exit point!"
                this.haveToKillAll = true;
                this.initModelLevel_2();
                this.initLightingLevel_2();
                this.initTextureLevel_2();
                break;
            case 3:
                target = "Find the 'Key' and go to Safe Zone!"
                this.haveToKillAll = false;
                this.initModelLevel_3();
                this.initLightingLevel_3();
                this.initTextureLevel_3();
                break;

        }
        document.getElementById("target").textContent = "Target: " + target;
    }

    // ---------------------- Scene Level 1 ---------------------------
    // Inititate Object From Model Resource
    onResourcesLoadedLevel_1() {
        
        // Inititate tent (from the model source)
        // Game Scene
        this.meshes.game1 = this.models.game_1.mesh.clone();
        this.scene.add(this.meshes.game1);
        this.objects.push(this.meshes.game1);

        this.instantiateTent(-5, 2, -0.6);

        // Initiate player first weapon
        this.instantiatePlayerWeapon('Pistol');

        // Item pickup
        this.instantiateWeaponPickup('Pistol', 4, -2, true);
        this.instantiateWeaponPickup('ak47', 3, -1, true);
        this.instantiateReload(0, 1.2, 2);
        this.instantiateHp(-6, 1.3, 12);


        this.instantiateStump(1, 7, 4, 5); 
        this.instantiateStump(2, -4, 5, 2);
        this.instantiateStump(2, 24, 44, 2);
        this.instantiateStump(2, -5, 40, 2);
        this.instantiateStump(2, 7, 32, 1);
        this.instantiateStump(2, 9, 16, 1);

        this.instantiateLog(1, 7, 7, 2);
        this.instantiateLog(2, 10, 3, 2);

        // Pallet
        {
        this.meshes.pallet1 = this.models.pallet_1.mesh.clone();
        this.meshes.pallet1.position.set(12, 0, 3);
        this.scene.add(this.meshes.pallet1);
        this.bullet_collidables.push(this.meshes.pallet1);
        this.objects.push(this.meshes.pallet1);
        }

        // Road at start point, and ennd point
        {
            this.instantiateRoad(2, -4, 1);
            this.instantiateRoad(0, -2, 1.2);
            this.instantiateRoad(-2, 0, 1.4);
            this.instantiateRoad(-2, 2);
            this.instantiateRoad(0, 6);

            this.instantiateRoad(20, 50);
            this.instantiateRoad(19, 48);
            this.instantiateRoad(20, 44);
            this.instantiateRoad(18, 40);
            this.instantiateRoad(17, 39);
            
        }

        // Rock
        this.instantiateRock(1, 8, 0, 2, 2, 1);
        this.instantiateRock(1, -2, -8, 3, 3, 1);
        this.instantiateRock(2, -16, 6, 1, 1, 1);
        this.instantiateRock(2, 14, 0, 2, 2, 1);


        // Instantiate Tree by type
        {
            this.instantiateTree(1, 0, -9);
            this.instantiateTree(3, -2, -9);
            this.instantiateTree(1, -6, -8);
            this.instantiateTree(1, -9, -7);
            this.instantiateTree(1, -13, -5);
            this.instantiateTree(2, -15, -2); 
            this.instantiateTree(2, -17, 0); 
            this.instantiateTree(3, -17, 3); 
            this.instantiateTree(1, -17, 6); 
            this.instantiateTree(1, -14, 8); 
            this.instantiateTree(1, -11, 7); 
            this.instantiateTree(1, -13, 9); 

            this.instantiateTree(2, 2, -9);
            this.instantiateTree(3, 5, -10);
            this.instantiateTree(1, 8, -10);
            this.instantiateTree(1, 11, -12);
            this.instantiateTree(3, 15, -12);
            this.instantiateTree(1, 18, -11);
            this.instantiateTree(3, 21, -11);
            this.instantiateTree(1, 25, -12);
            this.instantiateTree(2, 28, -9);
            this.instantiateTree(3, 28, -5);
            this.instantiateTree(2, 25, -7);
            this.instantiateTree(3, 23, -5);
            this.instantiateTree(1, 21, -5);
            this.instantiateTree(3, 20, -3);
            this.instantiateTree(3, 20, 0);
            this.instantiateTree(1, 20, 3);
            this.instantiateTree(2, 20, 6);
            this.instantiateTree(3, 20, 9);
            this.instantiateTree(2, 16, 6);
            this.instantiateTree(3, 13, 7);
            this.instantiateTree(1, -19, 7);
            this.instantiateTree(1, -18, 10);
            this.instantiateTree(1, -18, 14);
        }
        
        // Spown Enemy
        {
            this.instantiateEnemy(this.models.enemy_1.mesh, 2, 1.5, 10, 6, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, -6, 1.5, 13, 5, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, -8, 1.5, 19, 5, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 19, 1.5, 9, 6, 12, 0.04);
            
            this.instantiateEnemy(this.models.enemy_1.mesh, 16, 1.5, 19, 5, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 19, 1.5, 24, 5, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 9, 1.5, 44, 6, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, -1, 1.5, 40, 5, 12, 0.04);

            this.instantiateEnemy(this.models.enemy_1.mesh, 4, 1.5, 37, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 6, 1.5, 33, 5, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 10, 1.5, 39, 5, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 10, 1.5, 24, 5, 12, 0.04);
            
            this.instantiateEnemy(this.models.enemy_1.mesh, 15, 1.5, 42, 6, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 14, 1.5, 37, 5, 12, 0.04);
        }

        // End point
        this.instantiateTent(23, 48, 1.2);
        this.instantiateExit(20, 1.3, 49);

    }
    // Inititate Model with Texture Maping
    initTextureLevel_1() {

        // Inititate crate cube box
        this.instatiateCrate(2.5, 0, 2.5, 3, 0x777799);
        this.instatiateCrate(4.5, 0, 1.0, 2, 0x997799);
        this.instatiateCrate(22, 0, 2, 2, 0x6ABA65)
        this.instatiateCrate(25, 0, -2, 2, 0x6ABA65)
    
        // Initiate floor
        this.instantiateGround(45, 50);
    }
    // Instantiate Object Model
    initModelLevel_1() {
        // Collision limit area
        this.instantiateBox(-20, -10, 30, 13);
        this.instantiateBox(0, -14, 30, 13);
        this.instantiateBox(30, -13, 30, 13);
        this.instantiateBox(50, 0, 30, 18);
        this.instantiateBox(46, 20, 12, 40);
        this.instantiateBox(38, 48, 15, 31);


        this.instantiateBox(-25, 10, 10, 43);
        this.instantiateBox(-22, 30, 10, 43);
        this.instantiateBox(-17, 50, 10, 33, 0.2);
        this.instantiateBox(5, 70, 30, 13, 0);
        this.instantiateBox(20, 70, 30, 13, 0);
        this.instantiateBox(20, 57, 30, 9, 0);
    }

    // ---------------------- Scene Level 2 ----------------------------
    onResourcesLoadedLevel_2(){

        // Game Scene
        this.game2 = this.models.game_2.mesh.clone();
        this.scene.add(this.game2);
        this.objects.push(this.game2);

        // Bus
        this.instantiateBus(65, 75, -1.5);
        this.instantiateBus(54, 80, 0.5);
        this.instantiateBus(44, 94, 0.75);
        this.instantiateBus(-13, 105, 0.9);
        this.instantiateBus(-12, 57, 0.9);
        this.instantiateBus(2, 45, 0);

        this.instantiateHome(1, 60, 46, 0);
        this.instantiateHomeBroken(12, 67, -0.3);
        this.instantiateHomeBroken(6, 82, -0.3);
        
        this.instantiateHome(2, 22, 106, 1.2);
        this.instantiateHome(2, -9, 93, 0);
        this.instantiateHome(2, 17, 146, 0);
        this.instantiateHome(2, -14, 126, 0);

        
        // Road from start point to weapon pickup table
        this.instantiateRoad(24, 48, 0);
        this.instantiateRoad(28, 52, 0);
        this.instantiateRoad(35, 54, 0);
        this.instantiateRoad(52, 55, 0);
        this.instantiateRoad(56, 57, 0);
        this.instantiateRoad(58, 56, 0);
        // Item pickup point
        this.instantiateWeaponPickup('Pistol', 62, 56, true);
        this.instantiateWeaponPickup('shotgun', 62, 58, true);
        this.instantiateHp(63, 1.3, 62);

        // Middle Part
        this.instantiateHome(1, 48, 120, 0);
        this.instantiateTree(1, 30, 100, false);
        this.instantiateTree(2, 31, 102, false);
        this.instantiateTree(3, 32, 117, false);
        this.instantiateTree(2, 30, 115, false);
        this.instantiateTree(3, 47, 106, true);
        this.instantiateTree(2, 53, 108, true);
        this.instantiateTree(3, 50, 109, true);

        this.instantiateTree(3, 35, 117, true);
        this.instantiateRoad(24, 48, 0);
        this.instantiateRoad(18, 85, 0);
        this.instantiateRoad(15, 89, 0);
        this.instantiateRoad(11, 93, 0);

        {
            this.instantiateEnemy(this.models.enemy_1.mesh, 27, 1.5, 72, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 37, 1.5, 73, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 44, 1.5, 77, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 32, 1.5, 87, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 32, 1.5, 95, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 25, 1.5, 94, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 3, 1.5, 94, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, -1, 1.5, 106, 7, 12, 0.04);

            this.instantiateEnemy(this.models.enemy_1.mesh, 12, 1.5, 67, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, -5, 1.5, 70, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 0, 1.5, 61, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 0, 1.5, 62, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 6, 1.5, 83, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 4, 1.5, 78, 7, 12, 0.04);

            this.instantiateEnemy(this.models.enemy_1.mesh, 17, 1.5, 84, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 8, 1.5, 97, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 9, 1.5, 114, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 22, 1.5, 123, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 20, 1.5, 123, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 25, 1.5, 136, 7, 12, 0.04);
            this.instantiateEnemy(this.models.enemy_1.mesh, 22, 1.5, 130, 7, 12, 0.04);
        }

        
        // Item in home
        this.instantiateReload(14, 1.2, 63);
        this.instantiateHp(1.5, 1.3, 84);

        // Road to end point
        this.instantiateRoad(12, 119, 0);
        this.instantiateRoad(10, 117, 0);
        this.instantiateHome(1, 1, 137, 0);

        this.instantiateHome(1, 38, 142, 0);
        // End point
        this.instantiateExit(35, 1.3, 127);

    }
    initTextureLevel_2(){
        // Ground
        this.instantiateGround(35, 95);
    }
    initModelLevel_2(){
        // Scene limit collision
        this.instantiateBox(12, 41, 12, 20);

        this.instantiateBox(25, 33, 35, 12);
        this.instantiateBox(48, 32, 12, 20);
        this.instantiateBox(71, 56, 12, 30);

        this.instantiateBox(-17, 115, 16, 22);
        this.instantiateBox(-21, 76, 16, 22);
        this.instantiateBox(26, 146, 10, 10);

    }

    // ---------------------- Scene Level 3 ----------------------------
    onResourcesLoadedLevel_3(){
        // Game Scene
        this.game3 = this.models.game_3.mesh.clone();
        this.scene.add(this.game3);
        this.objects.push(this.game3);

        // Item Pickup Point
        this.instantiateWeaponPickup("Pistol", 48, 110, true);
        this.instantiateWeaponPickup("ak47", 50, 111, true);
        this.instantiateWeaponPickup("shotgun", 52, 116, true);
        this.instantiateReload(44, 1.3, 110);
        this.instantiateHp(46, 1.3, 110);

        // Item Pickup
        this.instantiateHp(140, 1.3, 185);
        this.instantiateReload(141, 1.3, 182);

        this.instantiateHp(87, 1.3, 211);
        this.instantiateReload(85, 1.3, 212);


        this.instantiateBuildingU(145, 189, 0);
        this.instantiateBuildingU(80, 177, Math.PI/2);

        this.instantiateBus(107, 232, -0.85);
        this.instantiateBus(89, 228, -0.35);

        this.instantiateBus(83, 204, -0.15 - Math.PI);
        this.instantiateBus(73, 210, -0.35);
        this.instantiateBus(71, 203, -0.35);
        this.instantiateBus(49, 191, -2);
        this.instantiateBus(46, 198, -1.45);
        this.instantiateBus(49, 207, -1);

        {
            this.instantiateEnemy(this.models.enemy_1.mesh, 68, 1.5, 135, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 82, 1.5, 126, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 83, 1.5, 137, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 92, 1.5, 141, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 104, 1.5, 138, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 113, 1.5, 154, 8, 12, 0.05);

            this.instantiateEnemy(this.models.enemy_1.mesh, 122, 1.5, 143, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 121, 1.5, 127, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 106, 1.5, 124, 8, 12, 0.05);

            this.instantiateEnemy(this.models.enemy_1.mesh, 123, 1.5, 164, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 114, 1.5, 170, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 137, 1.5, 184, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 123, 1.5, 211, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 114, 1.5, 204, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 127, 1.5, 201, 8, 12, 0.05);

            this.instantiateEnemy(this.models.enemy_1.mesh, 117, 1.5, 190, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 106, 1.5, 193, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 102, 1.5, 203, 8, 12, 0.05);
            
            this.instantiateEnemy(this.models.enemy_1.mesh, 56, 1.5, 195, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 71, 1.5, 190, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 76, 1.5, 184, 8, 12, 0.05);
            this.instantiateEnemy(this.models.enemy_1.mesh, 71, 1.5, 179, 8, 12, 0.05);
            
        }

        this.instantiateKey(82, 179);
        this.instantiateDoor(55.9, 180.5, 0);
        this.instantiateExit(60, 1.3, 177);

    }
    initTextureLevel_3() {
        // Ground
        this.instantiateGround(80, 170, 200, 180);
    }
    initModelLevel_3() {
        this.instantiateBox(105, 120, 96, 6);
        this.instantiateBox(26, 125, 10, 35);
        this.instantiateBox(44, 106, 28, 5);
        this.instantiateBox(62, 110, 10, 10);
        
        this.instantiateBox(45, 140, 30, 8);
        this.instantiateBox(80, 145, 35, 4);
        this.instantiateBox(61, 139, 8, 8);
        this.instantiateBox(109, 160, 3, 26);
        this.instantiateBox(101, 146, 10, 5);
        this.instantiateBox(101, 176, 17, 17);

        this.instantiateBox(130, 124, 4, 4);
        this.instantiateBox(130, 155, 4, 9);
        this.instantiateBox(135, 145, 4, 56);

        this.instantiateBox(135, 215, 2, 20);
        this.instantiateBox(124, 217, 17, 2);
        this.instantiateBox(114, 223, 2, 12);

        this.instantiateBox(70, 225, 20, 4);
        this.instantiateBox(56, 221, 10, 4);
        this.instantiateBox(51, 218, 4, 4);
        
        this.instantiateBox(62, 180, 4, 1);
        this.instantiateBox(53, 180, 4, 1);
        this.instantiateBox(50, 176, 1, 4);
        this.instantiateBox(55, 173, 7, 1);
        
        this.instantiateBox(50, 181, 3, 3);
    }




    instantiateCurrentWeapon(weapon, show){
        return new Weapon(this, show, {
            name: weapon.name,
            model: weapon.model,
            shootType: weapon.shootType,
            totalMaxBulletDefault: weapon.totalMaxBulletDefault,
            totalMaxBullet: weapon.totalMaxBullet,
            totalBullet: weapon.maxBullet,
            currentBullet: weapon.currentBullet,
            reloadTime: weapon.reloadTime,
            shootBuffer: weapon.shootBufferNeed,
        })
    }

    // ------- Function every instantiate resource object ----------
    instantiateTent(posx, posz, rot=0){
        this.meshes.tent1 = this.models.tent.mesh.clone();
        this.meshes.tent1.position.set(posx, 0, posz);
        this.meshes.tent1.rotation.y = rot;
        this.scene.add(this.meshes.tent1);

        this.collidables.push(this.meshes.tent1);
        this.bullet_collidables.push(this.meshes.tent1);
        this.objects.push(this.meshes.tent1);
    }
    instantiateRoad(posx, posz, rot=0){
        this.meshes.road1 = this.models.road_1.mesh.clone();
        this.meshes.road1.position.set(posx, 0, posz);
        this.meshes.road1.rotation.y = rot;

        this.scene.add(this.meshes.road1);
        this.objects.push(this.meshes.road1);

    }
    instantiateTree(type, posx, posz, collide=false){
        this.meshes.tree = null;
        switch (type){
            case 1:
                this.meshes.tree = this.models.tree_1.mesh.clone();
                break;
            case 2:
                this.meshes.tree = this.models.tree_2.mesh.clone();
                break;
            case 3:
                this.meshes.tree = this.models.tree_3.mesh.clone();
                break;
            default:
                console.log("Error Tree Load: ", type);
                break;
        }
        this.meshes.tree.position.set(posx, 0, posz);
        this.scene.add(this.meshes.tree);
        
        if (collide){
            this.collidables.push(this.meshes.tree);
            this.bullet_collidables.push(this.meshes.tree);
        }
        this.objects.push(this.meshes.tree);
    }
    instantiatePlayerWeapon(type){
        console.log("Current weapon: ", this.weapon);

        switch (type){
            case ('Pistol'):
                if (this.weapon_1)
                    this.weapon_1.kill();
                // Save the current weapon information.
                if (this.weapon && this.weapon_2){
                    if (this.weapon.name == this.weapon_2.name)
                        this.weapon_2 = this.instantiateCurrentWeapon(this.weapon, false)
                    this.weapon.kill();
                }

                this.weapon = new Weapon(this, true, {
                    name: type,
                    model: this.models.small_gun.mesh,
                    shootType: 'manual',
                    totalMaxBulletDefault: -1,
                    totalMaxBullet: -1,
                    totalBullet: 30,
                    currentBullet: 30,
                    reloadTime: 2,
                    shootBuffer: 10,
                });
                this.weapon_1 = this.weapon;

                break;

            case ('ak47'):
                if (this.weapon_2)
                    this.weapon_2.kill();
                // Save the current weapon information.
                if (this.weapon.name == this.weapon_1.name)
                    this.weapon_1 = this.instantiateCurrentWeapon(this.weapon, false)
                this.weapon.kill();
                
                this.weapon = new Weapon(this, true, {
                    name: type,
                    model: this.models.ak47.mesh,
                    shootType: 'auto',
                    totalMaxBulletDefault: 240,
                    totalMaxBullet: 240,
                    totalBullet: 60,
                    currentBullet: 60,
                    reloadTime: 3.5,
                    shootBuffer: 4,
                });
                this.weapon_2 = this.weapon;

                break;
            case ('shotgun'):
                if (this.weapon_2)
                    this.weapon_2.kill();
                this.weapon.kill();

                this.weapon = new Weapon(this, true, {
                    name: type,
                    model: this.models.shotgun.mesh,
                    shootType: 'manual',
                    totalMaxBulletDefault: 24,
                    totalMaxBullet: 24,
                    totalBullet: 8,
                    currentBullet: 8,
                    reloadTime: 2,
                    shootBuffer: 32,
                });
                this.weapon_2 = this.weapon;
                break;
        }
        // Show crosshair after weapon is equipped
        const crosshair = document.getElementById("crosshair");
        if (crosshair) {
            crosshair.style.display = "block";
        }
    }

    instantiateWeaponPickup(type, posx, posz, keepExist=false){
        let weaponPickup = null;
        switch (type) {
            case ('ak47'):
                weaponPickup = new WeaponPickup(this, {
                    name: type,
                    model: this.models.ak47.mesh,
                    pos: new THREE.Vector3(posx, 1.3, posz),
                    sca: new THREE.Vector3(0.4, 0.4, 0.4),
                    keepExist: keepExist
                });

                break;
            case ('Pistol'):
                weaponPickup = new WeaponPickup(this, {
                    name: type,
                    model: this.models.small_gun.mesh,
                    pos: new THREE.Vector3(posx, 1.35, posz),
                    sca: new THREE.Vector3(0.55, 0.5, 0.5),
                    keepExist: keepExist
                });

                break;
            case ('shotgun'):
                weaponPickup = new WeaponPickup(this, {
                    name: type,
                    model: this.models.shotgun.mesh,
                    pos: new THREE.Vector3(posx, 1.35, posz),
                    sca: new THREE.Vector3(0.4, 0.4, 0.4),
                    keepExist: keepExist
                });

                break;
        }

        this.weaponCollidebles.push(weaponPickup);
        this.objects.push(weaponPickup);
    }
    instantiateStump(type, posx, posz, scale, collide=true){
        switch (type){
            case 1:
                this.meshes.stump = this.models.stump_1.mesh.clone();
                break;
            case 2:
                this.meshes.stump = this.models.stump_2.mesh.clone();
                break;
            default:
                console.log("Error Stump Load: ", type);
                break;
        }
        this.meshes.stump.position.set(posx, 0, posz);
        this.meshes.stump.scale.set(scale, 2, scale);
        this.scene.add(this.meshes.stump);
        
        if (collide){
            this.collidables.push(this.meshes.stump);
            this.bullet_collidables.push(this.meshes.stump);
        }
        this.objects.push(this.meshes.stump);
    }
    instantiateLog(type, posx, posz, scale, collide=false){
        switch (type){
            case 1:
                this.meshes.log = this.models.log_1.mesh.clone();
                break;
            case 2:
                this.meshes.log = this.models.log_2.mesh.clone();
                break;
            default:
                console.log("Error Log Load: ", type);
                break;
        }
        this.meshes.log.position.set(posx, 0, posz);
        this.meshes.log.scale.set(scale, 2, scale);
        this.scene.add(this.meshes.log);
        
        if (collide){
            this.collidables.push(this.meshes.log);
            this.bullet_collidables.push(this.meshes.log);
        }
        this.objects.push(this.meshes.log);
    }
    instantiateRock(type, posx, posz, scax, scaz, rotate, collide=true){
        switch (type){
            case 1:
                this.meshes.rock = this.models.rock_1.mesh.clone();
                break;
            case 2:
                this.meshes.rock = this.models.rock_2.mesh.clone();
                break;
            default:
                console.log("Error Rock Load: ", type);
                break;
        }
        this.meshes.rock.position.set(posx, 0, posz);
        this.meshes.rock.scale.set(scax, 2, scaz);
        this.meshes.rock.rotation.y = rotate;
        this.scene.add(this.meshes.rock);
        
        if (collide){
            this.collidables.push(this.meshes.rock);
            this.bullet_collidables.push(this.meshes.rock);
        }
        this.objects.push(this.meshes.rock);
    }
    instantiateReload(posx, posy, posz){
        const reload = this.models.reload.mesh.clone();
        reload.receiveShadow = true;
        reload.castShadow = true;
        reload.position.set(posx, posy, posz);
        reload.scale.set(0.5, 0.5, 0.5);
        
        this.scene.add(reload);
        this.reloadCollidebles.push(reload);
        this.objects.push(reload);
    }
    instantiateHp(posx, posy, posz){
        const hp = this.models.hp.mesh.clone();
        hp.position.set(posx, posy, posz);

        this.scene.add(hp);
        this.healt_box.push(hp);
        this.objects.push(hp);
    }
    instantiateExit(posx, posy, posz){
        this.exit = this.models.exit.mesh.clone();
        this.exit.position.set(posx, posy, posz);
        this.exit.scale.set(4, 4, 4);

        this.scene.add(this.exit);
        this.objects.push(this.exit);
    }
    instantiateBus(posx, posz, rot=0){
        this.meshes.bus1 = this.models.bus_1.mesh.clone();
        this.meshes.bus1.position.set(posx, 0, posz);
        this.meshes.bus1.scale.set(3, 3, 3);
        this.meshes.bus1.rotation.y = rot;
        this.scene.add(this.meshes.bus1);

        this.collidables.push(this.meshes.bus1);
        this.bullet_collidables.push(this.meshes.bus1);
        this.objects.push(this.meshes.bus1);

    }
    instantiateHome(type, posx, posz, rot=0){
        switch (type){
            case 1:
                this.meshes.home = this.models.home_1.mesh.clone();
                break;
            case 2:
                this.meshes.home = this.models.home_2.mesh.clone();
                break;
        }
        this.meshes.home.position.set(posx, 0, posz);
        this.meshes.home.rotation.y = rot;
        this.scene.add(this.meshes.home);

        this.collidables.push(this.meshes.home);
        this.bullet_collidables.push(this.meshes.home);
        this.objects.push(this.meshes.home);
    }
    instantiateHomeBroken(posx, posz, rot){
        this.meshes.home = this.models.home_broken.mesh.clone();

        this.meshes.home.position.set(posx, 0, posz);
        this.meshes.home.rotation.y = rot;
        this.scene.add(this.meshes.home);

        this.objects.push(this.meshes.home);

        let hb_1 = this.models.home_broken_1.mesh.clone();
        let hb_2 = this.models.home_broken_2.mesh.clone();
        let hb_3 = this.models.home_broken_3.mesh.clone();
        let hb_4 = this.models.home_broken_4.mesh.clone();
        let hbs = [hb_1, hb_2, hb_3, hb_4];

        for (let hb of hbs){
            hb.position.set(posx, 0, posz);
            hb.rotation.y = rot;

            this.collidables.push(hb);
            this.bullet_collidables.push(hb);
            this.objects.push(hb);
        }

    }
    instantiateBuildingU(posx, posz, rot){
        let building = this.models.building_u.mesh.clone();
        building.position.set(posx, 0, posz);
        building.rotation.y = rot;
        this.scene.add(building);

        this.objects.push(building);

        let bu_1 = this.models.building_u_1.mesh.clone();
        let bu_2 = this.models.building_u_2.mesh.clone();
        let bu_3 = this.models.building_u_3.mesh.clone();
        let bus = [bu_1, bu_2, bu_3];

        for (let bu of bus){
            bu.position.set(posx, 0, posz);
            bu.rotation.y = rot;

            this.collidables.push(bu);
            this.bullet_collidables.push(bu);
            this.objects.push(bu);
        }
    }
    instantiateDoor(posx, posz, rot=0){
        const _position = new THREE.Vector3(posx, 0.3, posz);
        let door = new Door(this, this.models.iron_fence.mesh, {
            position: _position,
            rotation: rot
        });

        this.objects.push(door);
    }
    instantiateKey(posx, posz){
        this.key = this.models.key.mesh.clone();
        this.key.position.set(posx, 1.3, posz);
        this.scene.add(this.key);
    }



    // ------- Function every instantiate texture object ----------
    instantiateGround(posx, posz, sizex=160, sizey=140){
        let textureLoader_ground = new THREE.TextureLoader(this.loadingManager);
        let groundTexture = textureLoader_ground.load("materials/Grounds/Grass.png");
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(10, 10);
        let material = new THREE.MeshPhongMaterial({ map: groundTexture, side: THREE.DoubleSide });


        var floorMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(sizex, sizex, sizey, sizey),
            new THREE.MeshPhongMaterial({ 
                color: "#8AEA85", wireframe: USE_WIREFRAME, 
                map: groundTexture, side: THREE.DoubleSide
            })
        );
        floorMesh.position.set(posx, 0, posz);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.receiveShadow = true;
        
        this.scene.add(floorMesh);
        this.bullet_collidables.push(floorMesh);
        this.objects.push(floorMesh);
    }
    instatiateCrate(posx, posy, posz, size, color=0xffffff){
        const textureLoader = new THREE.TextureLoader(this.loadingManager);
        const crateBumpMap = textureLoader.load("materials/Objects/crate0_bump.jpg");

        this.crate_box = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshPhongMaterial({ color: color, bumpMap: crateBumpMap })
        );
        let originy = 0.5 * size;
        this.crate_box.position.set(posx, originy + posy, posz);
        this.crate_box.receiveShadow = true;
        this.crate_box.castShadow = true;
        this.scene.add(this.crate_box);

        this.collidables.push(this.crate_box);
        this.bullet_collidables.push(this.crate_box);
        this.objects.push(this.crate_box);

    }

    // ------- Function every instantiate normal object ----------
    instantiateBox(posx, posz, scax, scaz, rot=0){
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(scax, 3, scaz), 
            new THREE.MeshPhongMaterial({ color: "#8AEA85", wireframe: false })
        );//8AEA85

        box.position.set(posx, 0, posz);
        box.rotation.y = rot;
        // Debug used
        // this.scene.add(box);

        this.collidables.push(box);
        this.objects.push(box);
    }

    instantiateEnemy(type, x, y, z, hp, chase, baseSpeed) {
        let speedMultiplier = 1;
        if (this.difficulty === 2) speedMultiplier = 1.5;
        else if (this.difficulty === 3) speedMultiplier = 2.0;

        const finalSpeed = baseSpeed * speedMultiplier;
        const pos = new THREE.Vector3(x, y, z);
        const newEnemy = new Enemy(pos, type, this, hp, chase, finalSpeed);
        this.enemy.push(newEnemy);
        this.targetEnemy += 1;
    }

    gameFinish(){
        if (this.gameOver)
            return;

        console.log(this.currentEnemy, " / ", this.targetEnemy);

        if (this.targetEnemy == this.currentEnemy || ! this.haveToKillAll){
            this.gameOver = true;
            this.RESOURCES_LOADED = false;
            this.loadingScreen = new LoadingScreen();
            
            //// Goto next level
            this.level += 1;
            this.targetEnemy = 0;
            
            // Clear all the object of current level
            this.clearObjects();

            this.scene.remove(this.exit);
            
            if (this.level > 3){
                // Game Finish, Display Ended
                showFinishGame(Story_end);
                this.playSFX(GAME_WIN, 0.35);
                return;
            }

            // Instantiate Objects
            this.setupLoadingManager(this.level);
            this.setupSceneObjects(this.level);
            
            this.gameOver = false;

        }
    }



    // ------------------------ Part of Animation MainLoop -----------------------------

    // Animation Loop
    animate() {

        this.animationId = requestAnimationFrame(this.animate.bind(this));

        // Play the loading screen until resources are loaded.
        if (!this.RESOURCES_LOADED) {
            this.loadingScreen.animate();
            this.renderer.render(this.loadingScreen.scene, this.loadingScreen.camera);
            return;
        }

        const time = Date.now() * 0.0005;
        this.delta = this.clock.getDelta();

        // Update every healt box and reload
        this.updateHealtBox()
        this.updateReload();
        this.updateWeaponPickup();
        this.updateExit();
        this.updateKey();

        // Update bullets
        this.updateBullets(this.delta);


        // Update Player
        this.updatePlayer();

        // Update weapon position
        this.updatePlayerWeapon(time, this.camera);
        

        for (const _enemy of this.enemy) {
            _enemy.update(this.camera); // Pass the player's camera
        }


        this.updateHUD();
        
        this.renderer.render(this.scene, this.camera);
    }

    

    // ------- Function Animation update ----------
    updatePlayer(){
        

        this.player.handleMovement(this.keyboard, this.camera, this);
        // Update mouse look if pointer is locked
        if (this.isPointerLocked) {
            this.player.rotateCameraWithMouse(
                this.mouseX - this.prevMouseX, 
                this.mouseY - this.prevMouseY, 
                this.camera
            );
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
        }
        
    }
    // Update Player weapon position and rotation
    updatePlayerWeapon(time, camera) {
        if (! this.weapon)
            return;

        this.weapon.weaponShoot(this, this.player);
        this.weapon.updatePosition(time, camera, this.keyboard);
    }
    
    updateBullets(delta){
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(delta);
            return bullet.alive;
        });
    }
    updateHealtBox(){
        for (let obj of this.healt_box){
            obj.rotation.y += 0.02;
            // obj.rotation.x += 0.02;
            // obj.rotation.z += 0.02;
        }
    }
    updateReload(){
        for (let obj of this.reloadCollidebles){
            obj.rotation.y += 0.03;
        }
    }
    updateWeaponPickup(){
        for (let obj of this.weaponCollidebles){
            // console.log(obj.mesh.rotation);
            obj.mesh.rotation.y += 0.03;
        }
    }
    updateExit(){
        if (this.exit != null)
            this.exit.rotation.y += 0.05;
    }
    updateKey(){
        if (this.key != null)
            this.key.rotation.y += 0.04;
    }


    // Keyboard and Mouse Input fellback
    handleKeyDown(event) {
        this.keyboard[event.keyCode] = true;
        // Weapon reload key
        if (event.key == 'r' || event.key == 'R'){
            if (! this.weapon) return;
            this.weapon.reload();
        }
        // Item pickup key
        else if (event.key == 'f' || event.key == 'F'){
            this.player.handleMovement(this.keyboard, this.camera, this, true)
        }
        // Change first weapon
        else if (event.key == '1'){
            this.player.changeWeapon(this, 1);
        }
        // Change second weapon
        else if (event.key == '2'){
            this.player.changeWeapon(this, 2);
        }

    }
    handleKeyUp(event) {
        this.keyboard[event.keyCode] = false;
    }
    handleMouseDown(event) {
        this.isMouseDown = true;
        console.log(this.camera.position);
    }
    handleMouseUp(event) {
        this.isMouseDown = false;
    }
    handleMouseMove(event) {
        if (!this.isPointerLocked) return;

        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.player.rotateCameraWithMouse(movementX, movementY, this.camera);
    }
    
    
    handlePointerLockChange() {
        this.isPointerLocked = (
            document.pointerLockElement === this.renderer.domElement ||
            document.mozPointerLockElement === this.renderer.domElement ||
            document.webkitPointerLockElement === this.renderer.domElement
        );

        if (this.isPointerLocked) {
            // Reset mouse position tracking when pointer is locked
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
        }
    }

    clearObjects() {
        // Clear all the object of current level
        for (let obj of this.objects){
            this.scene.remove(obj.mesh);
            this.scene.remove(obj);
        }
        for (let enm of this.enemy){
            this.scene.remove(enm.mesh);
            this.scene.remove(enm);
        }
        for (let lgh of this.lighting){
            this.scene.remove(lgh);
        }

        this.collidables = [];
        this.bullet_collidables = [];
    }
}

/** Player Controller.
 * 
 * Handles player movement, shooting, health, collisiob, and all interactions with World.
*/
class Player {
    constructor() {
        this.height = 1.8;
        this.speed = 0.07;
        this.dashSpeed = 0.13;
        this.squat = false;

        this.turnSpeed = Math.PI * 0.02;
        this.shootBuffer = 0;
        this.shootContinuous = false;
        this.canShoot = true;

        // Vertical rotation limits
        this.minPitch = -Math.PI * 0.75; // Min view Below
        this.maxPitch = -Math.PI * 1.15;  // max view Above

        this.maxHp = 5;
        this.hp = this.maxHp;
        this.canHurt = true;

        this.isReloading = false;
        this.reloadTimer = 0;
        this.totalBulletNumber = 120;
        this.maxBulletNumber = 30;
        this.bulletNumber = this.maxBulletNumber;
    }


    getPlayerBox(position) {
        const boxSize = 0.3; // Width & depth
        const height = 1;
    
        return new THREE.Box3().setFromCenterAndSize(
            position.clone(),
            new THREE.Vector3(boxSize, height, boxSize)
        );
    }

    handleMovement(keyboard, camera, game, picked=false) {
        const moveVector = new THREE.Vector3();
        
        if (keyboard[32]) {
            this.squat = true;
            camera.position.y = 1;
        }
        else {
            this.squat = false;
            camera.position.y = 2;
        }

        // WASD keys
        if (keyboard[87]) moveVector.z += 1; // W
        if (keyboard[83]) moveVector.z -= 1; // S
        if (keyboard[65]) moveVector.x -= 1; // A
        if (keyboard[68]) moveVector.x += 1; // D

        // Shift key, holding to run
        if (keyboard[16] && ! this.squat) {
            moveVector.normalize().multiplyScalar(this.dashSpeed);
        }
        else {
            if (! this.squat)   moveVector.normalize().multiplyScalar(this.speed);
            else                moveVector.normalize().multiplyScalar(this.speed / 2);
        }
        


        // Direction & strafe
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();


        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        const offset = new THREE.Vector3();
        offset.add(forward.clone().multiplyScalar(moveVector.z));
        offset.add(right.clone().multiplyScalar(moveVector.x));

        // Predict next camera position
        const nextPos = camera.position.clone().add(offset);

        const nextBox = this.getPlayerBox(nextPos);

        // Collision
        this.checkCollideEnemy(nextBox, game);
        this.checkCollideExit(nextBox, game);
        // Only check if 'f' key just pressed
        if (picked){
            this.checkCollideHeartBox(nextBox, game);
            this.checkCollideReload(nextBox, game);
            this.checkCollideWeaponPickup(nextBox, game);
            this.checkCollideDoor(nextBox, game);
            this.checkCollideKey(nextBox, game);
        }


        if (this.checkCollideWorld(nextBox, game)){
            camera.position.copy(nextPos);
        }


    }
    checkCollideWorld(nextBox, game){
        // Collision with world object
        for (let obj of game.collidables) {
            let objBox = new THREE.Box3().setFromObject(obj);
            if (nextBox.intersectsBox(objBox)) {
                return false;
            }
        }
        return true;
    }
    checkCollideHeartBox(nextBox, game){
        if (this.hp == this.maxHp) return

        // Collision with health box
        for (let obj of game.healt_box){
            let objBox = new THREE.Box3().setFromObject(obj);
            if (nextBox.intersectsBox(objBox)) {
                // Delete the self in scene enemy list
                const index = game.healt_box.indexOf(obj);
                if (index > -1)
                    game.healt_box.splice(index, 1);

                game.scene.remove(obj);
                
                console.log(obj);
                this.hp = this.maxHp;
                game.playSFX(HEALING, 0.3);
            }
        }
    }
    checkCollideEnemy(nextBox, game){
        if (! this.canHurt || this.hp < 0) return;

        // Collision with Enemy box
        for (let obj of game.enemy){
            let objenemy = new THREE.Box3().setFromObject(obj.mesh);
            if (! nextBox.intersectsBox(objenemy)) 
                continue;

            // game.scene.remove(obj);
            this.hp -= 1;
            this.canHurt = false;
            this.canHurtTimer(1);
            game.playSFX(HURT_SFX, 1);

            console.log("player hit: ", this.hp);
            
        }

        if (this.hp <= 0) {
            showGameLose();
            game.clearObjects();
            game.scene.remove(game.weapon.mesh);
            game.playSFX(GAME_LOSE, 0.5);
            return;
        }
    }
    checkCollideReload(nextBox, game){
        if (! game.weapon) return;
        if (game.weapon.totalMaxBullet == game.weapon.totalMaxBulletDefault) return;


        for (let obj of game.reloadCollidebles){
            let objBox = new THREE.Box3().setFromObject(obj);
            if (! nextBox.intersectsBox(objBox))
                continue;
        
            game.scene.remove(obj);

            game.playSFX(RELOAD_SFX);
            game.weapon.totalMaxBullet = game.weapon.totalMaxBulletDefault;
            
        }
    }
    checkCollideWeaponPickup(nextBox, game){
        for (let obj of game.weaponCollidebles){
            let objBox = new THREE.Box3().setFromObject(obj.mesh);
            if (! nextBox.intersectsBox(objBox)) 
                continue;

            console.log(obj);
            let type = obj.name;

            if (game.weapon == null)
                game.instantiatePlayerWeapon(type);
            else
                this.addWeapon(game, type);

            obj.take();
            
            
        }
    }
    checkCollideExit(nextBox, game){
        if (game.gameOver) return;
        // if (game.targerEnemy > game.currentEnemy) return;


        let objBox = new THREE.Box3().setFromObject(game.exit);
        if (! nextBox.intersectsBox(objBox))
            return;
        console.log("Game Clear");
        game.gameFinish();
    }
    checkCollideDoor(nextBox, game){
        for (let obj of game.doorCollidebles){
            let objBox = new THREE.Box3().setFromObject(obj.collisionBox);
            if (! nextBox.intersectsBox(objBox)) 
                continue;
            obj.openDoor();
        }
    }
    checkCollideKey(nextBox, game){
        if (! game.key) return;

        let objBox = new THREE.Box3().setFromObject(game.key);
        if (! nextBox.intersectsBox(objBox))
            return;
        game.scene.remove(game.key);
        game.hasKey = true;
    }

    addWeapon(game, type){
        game.playSFX(RELOAD_SFX);
        game.instantiatePlayerWeapon(type);
    }
    changeWeapon(game, number){

        switch (number){
            case 1:
                if (game.weapon_1 == null) return
                if (game.weapon.name == game.weapon_1.name) return

                game.weapon_2 = game.instantiateCurrentWeapon(game.weapon, false);
                game.weapon.kill();
                game.weapon = game.instantiateCurrentWeapon(game.weapon_1, true);
                game.playSFX(RELOAD_SFX);
                break;
            case 2:
                if (game.weapon_2 == null) return
                if (game.weapon.name == game.weapon_2.name) return

                game.weapon_1 = game.instantiateCurrentWeapon(game.weapon, false);
                game.weapon.kill();
                game.weapon = game.instantiateCurrentWeapon(game.weapon_2, true);
                game.playSFX(RELOAD_SFX);
                break;
        }

    }

    canHurtTimer(time=1){
        setTimeout(() =>{
            this.canHurt = true;
        }, time* 1000);
    }

    rotateCameraWithMouse(deltaX, deltaY, camera) {
        // Horizontal rotation
        // camera.rotation.y += deltaX * this.turnSpeed * 0.1;
        
        // Vertical Camera movement
        var newPitch = 0.0;
        var camera_rot_y = Math.abs(camera.rotation.y) % (Math.PI * 2)
        // Measure camera rotate correct in front and back view
        if (this.checkIsPlayerFront(camera_rot_y)) {
            newPitch = camera.rotation.x + deltaY * this.turnSpeed * 0.1;
        }else{
            newPitch = camera.rotation.x - deltaY * this.turnSpeed * 0.1;
        }

        camera.rotation.x = Math.min(this.minPitch, Math.max(this.maxPitch, newPitch));
        camera.rotation.y += deltaX * this.turnSpeed * 0.1;
    }


    checkIsPlayerFront(rot_x){
        if (rot_x < Math.PI/2 || rot_x > Math.PI * 3/2){
            return true
        }
        return false
    }

}


/** Weapon Controller
 * 
 * Handles weapon shooting, reloading, ammo management, and weapon positioning.
 */
class Weapon {
    constructor(game, show, option = {}){
        this.game = game;

        this.name = option.name;
        this.model = option.model;
        this.mesh = option.model.clone();
        this.shootType = option.shootType;

        this.totalMaxBulletDefault = option.totalMaxBulletDefault;
        this.totalMaxBullet = option.totalMaxBullet;
        this.maxBullet = option.totalBullet;
        if (option.currentBullet > 0)
            this.currentBullet = option.currentBullet
        else
            this.currentBullet = option.totalBullet;

        this.reloadTime = option.reloadTime;
        this.reloadTimer = 0;
        this.isReloading = false;
        this.shootBuffer = 0;
        this.shootBufferNeed = option.shootBuffer;



        this.mesh.traverse(node => {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                this.mesh.position.set(-5, 1, 0);
                this.mesh.scale.set(0.5, 0.5, 0.5);
            }
        });
        if (show)
            this.game.scene.add(this.mesh);

    }


    weaponShoot(game, player) {
        if (this.isReloading || this.currentBullet <= 0) {
            // this.game.playSFX("sounds/empty_click.mp3");
            return;
        }

        /////////
        var bullet_v_y = 0.0
        var camera_rot_y = Math.abs(game.camera.rotation.y) % (Math.PI * 2)
        if (player.checkIsPlayerFront(camera_rot_y)){
            bullet_v_y = Math.sin(game.camera.rotation.x)
        }else{
            bullet_v_y = -Math.sin(game.camera.rotation.x)
        }

        if (game.isMouseDown && this.shootBuffer <= 0) {

            if (this.name == 'shotgun')
                this.shootShootGun(this.game, bullet_v_y);
            else
                this.shootNormal(this.game, bullet_v_y);

            this.currentBullet -= 1;
            this.shootBuffer = this.shootBufferNeed;
            
            game.playSFX(SHOOT_SFX, 0.23);
            console.log(this.currentBullet);
        }

    
        if (this.shootType != 'auto'){
            game.isMouseDown = false;
        }

        this.shootBuffer -= 1;

        // Auto reload if empty
        if (this.currentBullet <= 0) {
            this.reload();
            }

    }

    shootNormal(game, posy){
        const bullet = new Bullet(
            // Bullet Position
            this.mesh.position,
            // Bullet Velocity
            new THREE.Vector3(-Math.sin(game.camera.rotation.y) * 0.8, 
                                posy, 
                                Math.cos(game.camera.rotation.y) * 0.8),
            // World Scene
            game,
            game.bullet_collidables
        );
        
        game.bullets.push(bullet);
    }

    shootShootGun(game, posy){
        for (let i=0; i < 12; i++) {
            let offsetScale = 0.15;
            if (game.player.squat)
                offsetScale = 0.05;

            const bullet = new Bullet(
                // Bullet Position
                this.mesh.position,
                // Bullet Velocity
                new THREE.Vector3(-Math.sin(game.camera.rotation.y) * 0.6 + (-offsetScale + Math.random() * offsetScale * 2), 
                                    posy * 0.8 + (-offsetScale + Math.random() * offsetScale * 2), 
                                    Math.cos(game.camera.rotation.y) * 0.6 + (-offsetScale + Math.random() * offsetScale * 2)),
                // World Scene
                game,
                game.bullet_collidables
            );
            
            game.bullets.push(bullet);
        }
        game.playSFX(RELOAD_SFX, 0.4);
    }


    reload() {
        if (this.isReloading || this.currentBullet === this.maxBullet || this.totalMaxBullet == 0) return;

        this.reloadTimer = 0;
        this.isReloading = true;
        this.game.playSFX(RELOAD_SFX);


    }

    reload_bullet_number(type) {
        let toReload = 0;
        
        if (type == 'shotgun') {
            toReload = 1  
            this.totalMaxBullet -= 1;
            
        }else {
            const needed = this.maxBullet - this.currentBullet;
            toReload = needed;

            if (this.totalMaxBullet != -1) {// '-1' mean unlimited
                toReload = Math.min(needed, this.totalMaxBullet);
                this.totalMaxBullet -= toReload;
            }   
        }

        return toReload;
    }

    updatePosition(time, camera, keyboard) {
        if (!this.mesh) return;

        // Animation speed for walk and run
        var animate_speed = 4;
        if (keyboard[16]) animate_speed = 25;
        else            animate_speed = 5;

        const bobY = Math.sin(time * animate_speed + camera.position.x + this.mesh.position.z) * 0.04;
    
        // Weapon base position (idle or reload)
        const baseX = camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75 - 0.2;
        const baseZ = camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75;
    
        var offsetY = camera.position.y - 0.5 + bobY;
        
        // Reloading animation
        if (this.isReloading) {
            this.reloadTimer += 0.05;
            
            var reloadOffset = Math.sin(this.reloadTimer * Math.PI);
            offsetY = camera.position.y - 0.5 - reloadOffset * 0.3;
    
            if (this.reloadTimer >= this.reloadTime) {
                this.reloadTimer = 0;
                this.isReloading = false;

                let toReload = this.reload_bullet_number(this.name);

                this.currentBullet += toReload;
                console.log("Reloaded");
            }
        }
        // Apply position and rotation
        this.mesh.position.set(baseX, offsetY, baseZ);
        this.mesh.rotation.set(
            camera.rotation.x,
            camera.rotation.y - Math.PI,
            camera.rotation.z
        );

    }


    kill(){
        this.game.scene.remove(this.mesh);
        this.game.removeObject(this);
        
    }
}

/** Bullet Controller
 * 
 * Handles bullet movement, collision detection, and hit effects.
 */
class Bullet {
    constructor(position, velocity, scene, collidables) {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshPhongMaterial({ color: "#332244" })
        );
        this.mesh.position.copy(position);
        this.mesh.position.y += 0.15;

        this.game = scene;
        this.alive = true;
        this.velocity = velocity;
        this.collidables = collidables;
        this.liveTime = 0.85;
        
        
        this.game.scene.add(this.mesh);
        
        this.timeoutId = setTimeout(() => this.kill(), this.liveTime * 1000);
    }

    update(delta) {
        if (!this.alive) return;

        this.liveTime -= delta;
        if (this.liveTime <= 0){
            this.kill();
            this.alive = false;
            return;
        }

        this.velocity.y -= 0.001;
        this.mesh.position.add(this.velocity);

        const bulletBox = new THREE.Box3().setFromObject(this.mesh);
        for (const obj of this.collidables) {
            
            const objBox = new THREE.Box3().setFromObject(obj);
            if (bulletBox.intersectsBox(objBox)) {
                this.createHitEffect(this.mesh.position);
                this.kill();
                return
            }
        }
 
        // Collision with Enemy box
        for (const obj of this.game.enemy) {
            
            const objBox = new THREE.Box3().setFromObject(obj.mesh);
            if (bulletBox.intersectsBox(objBox)) {
                this.createHitEffect(this.mesh.position);
                this.kill();
                obj.hp -= 1;
                console.log("hitted: ", obj.hp);
                return;
            }
        }
        

        
    }

    kill(){
        if (! this.alive) return;

        this.alive = false;
        this.game.removeObject(this);
        this.game.scene.remove(this.mesh);
    }


    // Spown the hit effect after the collision
    createHitEffect(position) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF4444, transparent: true, opacity: 0.8 });
        const hitEffect = new THREE.Mesh(geometry, material);
    
        hitEffect.position.copy(position);
        this.game.scene.add(hitEffect);
    
        setTimeout(() => {
            this.game.scene.remove(hitEffect);
            geometry.dispose();
            material.dispose();
        }, 300);
    }
}


/** Enemy Controller
 * 
 * Handles enemy movement, chasing behavior, health, and destruction.
 */
class Enemy {
    constructor(position, model, game, hp=10, chaseRange, speed = 0.05) {
        this.mesh = model.clone();
        this.mesh.position.copy(position);
        this.mesh.rotation.y = Math.random() * 3;
        
        // Make each enemy have difference start point
        this.idleOffset = Math.random() * 4;
        this.basePosY = position.y;

        this.speed = speed;
        this.alive = true;

        this.onChase = false;
        this.chaseRange = chaseRange;
        this.maxHp = hp;
        this.hp = hp;
        this.game = game;

        this.chasePart = this.generateChasePart(position, 3);
        this.currentChaseIndex = 0;
        
        // Optional: make sure enemy receives/casts shadows
        this.mesh.traverse(node => {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        game.scene.add(this.mesh);
    }

    update(playerCamera) {
        if (!this.alive) return;
        if (this.hp <= 0){
            this.destroy();
            return;
        }

        this.idleAnimation();

        // Check the distance between self and player
        const distanceToPlayer = this.mesh.position.distanceTo(playerCamera.position);
        if (distanceToPlayer > this.chaseRange) {
            this.onChase = false;
            this.idleState();
        }else {
            this.onChase = true;
            this.chaseState(playerCamera);
        }



        

    }

    idleState(){
        const target = this.chasePart[this.currentChaseIndex];
        let direction = new THREE.Vector3().subVectors(target, this.mesh.position);
        direction.y = 0;

        if (direction.length() < 0.1) {
            this.currentChaseIndex = (this.currentChaseIndex + 1) % this.chasePart.length;
            return;
        }

        direction = direction.normalize();
        let nextPos = this.mesh.position.clone().add(direction.multiplyScalar(this.speed * 0.3)); // slower patrol

        let enemyBox = new THREE.Box3().setFromCenterAndSize(
            nextPos.clone(),
            new THREE.Vector3(1, 2, 1) // Approx size: width, height, depth
        );

        let willCollide = false;
        for (let obj of this.game.collidables) {
            if (!obj) continue;
            const objBox = new THREE.Box3().setFromObject(obj);
            if (enemyBox.intersectsBox(objBox)) {
                willCollide = true;
                break;
            }  
        }

        // Make enemy look at position moving
        let diffPos = new THREE.Vector3(
                                    nextPos.x - this.mesh.position.x,
                                    1,
                                    nextPos.z - this.mesh.position.z
                                    );
        diffPos = diffPos.normalize();
        this.mesh.rotation.y = Math.atan2(diffPos.z, diffPos.x) + (Math.PI * 0.75);


        if (! willCollide) {
            this.mesh.position.copy(nextPos);
        }
    }

    chaseState(playerCamera){
        
        // Get direction toward player
        const direction = new THREE.Vector3().subVectors(playerCamera.position, this.mesh.position);
        direction.y = 0;
        direction.normalize();

        // Predict next position
        const nextPos = this.mesh.position.clone().add(direction.clone().multiplyScalar(this.speed));

        const enemyBox = new THREE.Box3().setFromCenterAndSize(
            nextPos.clone(),
            new THREE.Vector3(1, 2, 1)
        );


        let willCollide = false;
        for (const obj of this.game.collidables) {
            if (!obj) continue;
            const objBox = new THREE.Box3().setFromObject(obj);
            if (enemyBox.intersectsBox(objBox)) {
                willCollide = true;
                break;
            }
        }

        // Only move if no collision
        if (! willCollide) {
            this.mesh.position.copy(nextPos);
        }

        // Looking at the player
        let lookAtPos = playerCamera.position.clone();
        lookAtPos.y = this.mesh.position.y;
        this.mesh.lookAt(lookAtPos);
    }

    idleAnimation(){
        this.idleOffset += 0.05;
        this.mesh.position.y = this.basePosY + (Math.sin(this.idleOffset) * 0.25);
        // console.log(this.mesh.position.y)
    }


    generateChasePart(center, count) {
        const points = [];
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetZ = (Math.random() - 0.5) * 10;
            points.push(new THREE.Vector3(center.x + offsetX, 0, center.z + offsetZ));
        }
        return points;
    }


    destroy() {
        this.alive = false;
        this.game.playSFX(ENEMY_DIED_SFX, 0.8);
        
        // Delete the self in scene enemy list
        const index = this.game.enemy.indexOf(this);
        if (index > -1)
            this.game.enemy.splice(index, 1);
        
        this.game.scene.remove(this.mesh);
        this.game.removeObject(this);
        this.game.currentEnemy += 1;
    }
}


/** Weapon Pickup Controller
 * 
 * Handles weapon pickup interactions in the game world.
 */
class WeaponPickup{
    constructor(game, option = {}){
        this.game = game;

        this.mesh = option.model.clone();
        this.mesh.position.copy(option.pos);
        this.mesh.scale.copy(option.sca);
        
        this.name = option.name;
        this.keepExist = option.keepExist;
        
        this.initiate(option.pos, option.sca);
    }
    
    initiate(pos, sca){
        console.log(pos);
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        }

        this.game.scene.add(this.mesh);

    }

    take(){
        if (this.keepExist) return;

        this.game.scene.remove(this.mesh);
        this.game.removeObject(this);

    }
}

/** Interactable Door 
 * 
 * When Player get the key, able to open and close the door.
*/
class Door {
    constructor(game, mesh, option={}){
        this.game = game;
        this.mesh = mesh.clone();

        this.mesh.position.copy(option.position);
        this.mesh.rotation.y = option.rotation;
        this.collisionBox = null;

        this.collisionMesh;
        this.checkArea;
        this.open = false;

        this.mesh.traverse(node => {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        this.game.scene.add(this.mesh);
        this.game.collidables.push(this.mesh);
        this.instantiateCheckArea()

    }

    instantiateCheckArea() {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(6, 3, 6), 
            new THREE.MeshPhongMaterial({ color: "#8AEA85", wireframe: false })
        );

        box.position.copy(this.mesh.position);
        box.rotation.y = this.mesh.rotation.y;
        
        this.collisionBox = box;
        this.game.doorCollidebles.push(this);
    }

    openDoor(){
        if (! this.game.hasKey) return

        this.open = ! this.open;

        if (this.open){
            this.mesh.rotation.y -= Math.PI / 2
        }else {
            this.mesh.rotation.y += Math.PI / 2
        }
    }

}




/** Loading Screen Controller
 * 
 * Displays a simple loading screen with animation while the game assets are being loaded.
 */
class LoadingScreen {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100);
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: "#FFFACD" })
        );
        this.box.position.set(0, 0, 5);
        this.camera.lookAt(this.box.position);
        this.scene.add(this.box);
    }

    animate() {
        this.box.position.x -= 0.05;
        if (this.box.position.x < -10) this.box.position.x = 10;
        this.box.position.y = Math.sin(this.box.position.x);
    }
    kill() {
        // Dispose geometry and material
        this.box.geometry.dispose();
        this.box.material.dispose();
    
        // Remove from scene
        this.scene.remove(this.box);
    
        // Null references
        this.box = null;
        this.scene = null;
        this.camera = null;
    }
}



let selectedDifficulty = 1;
function selectDifficulty(level) {
    selectedDifficulty = level;
    document.getElementById("difficultyScreen").style.display = "none";
    game.difficulty = selectedDifficulty;
    game.init();
}

var gameInstance = null;
function launchGameWithDifficulty(level) {
    gameInstance = new Game(level);
    document.getElementById("difficultyDisplay").textContent = "📶 Difficulty: " + level;
    document.getElementById("crosshair").style.display = "none";
    gameInstance.init();
}



function showStoryline(text, _index=0) {
    let existing = document.getElementById('storyline');
    if (existing) existing.remove();

    let texts = text;
    let index = _index;

    const overlay = document.createElement('div');
    overlay.id = 'storyline';
    overlay.style.position = 'absolute';
    overlay.style.top = '60%';
    overlay.style.left = '10%';
    overlay.style.width = '70%';
    overlay.style.height = '20%';
    overlay.style.background = 'rgba(0,0,0,0.65)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.textAlign = 'center';
    overlay.style.fontSize = '1.5em';
    overlay.style.padding = '40px';
    overlay.style.zIndex = '1000';
    overlay.style.cursor = 'pointer';
    overlay.innerHTML = '<div><h2>Call</h2><p>' + texts[index] + '</p><p><em>Click to continue</em></p></div>';

    overlay.onclick = function () {
        index ++;
        // Continue display until finish text
        if (index >= texts.length)
            overlay.remove();
        else
            showStoryline(texts, index);
        
    };

    document.body.appendChild(overlay);
}
function showFinishGame(text, _index=0){
    let existing = document.getElementById('storyline');
    if (existing) existing.remove();

    let texts = text;
    let index = _index;

    const overlay = document.createElement('div');
    overlay.id = 'finishScene';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.95)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.textAlign = 'center';
    overlay.style.fontSize = '1em';
    overlay.style.padding = '40px';
    overlay.style.zIndex = '1000';
    overlay.innerHTML = '<div><h1>MISSION COMPLETE</h1><p>' + texts[index] + '</p><p><em>Click to continue</em></p></div>';
    document.body.appendChild(overlay);

    overlay.onclick = function () {
        index += 1;
        // Continue display until finish text
        if (index >= texts.length){
            overlay.remove();
            gameRestart();
            console.log("End");
        }
        else{
            showFinishGame(texts, index);
            overlay.remove();
        }
    };

}

function showGameLose(){
    let existing = document.getElementById('storyline');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'finishScene';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.95)';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.textAlign = 'center';
    overlay.style.fontSize = '1em';
    overlay.style.padding = '40px';
    overlay.style.zIndex = '1000';
    overlay.innerHTML = '<div><h1>YOU LOSE</h1><p><em>Click to continue</em></p></div>';
    document.body.appendChild(overlay);

    overlay.onclick = function () {
        overlay.remove();
        gameRestart();
        console.log("Dead");
    };
}

function gameRestart() {
    
    // Hide all game UI elements
    document.getElementById("difficultyDisplay").style.display = "none";
    document.getElementById("ammoDisplay").style.display = "none";
    document.getElementById("crosshair").style.display = "none";
    document.getElementById("hud").style.display = "none";
    document.getElementById("playerHpBar").style.display = "none";
    document.getElementById("enemyHpBars").innerHTML = "";
    
    // Show the start screen
    document.getElementById("startScreen").style.display = "flex";

    cancelAnimationFrame(gameInstance.animationId);
    location.reload();
}

