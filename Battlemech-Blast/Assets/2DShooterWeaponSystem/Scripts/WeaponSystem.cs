using System;
using System.IO;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Random = UnityEngine.Random;

namespace ShootingSystem
{

    /// <summary>
    /// The meat of the asset, the WeaponSystem component is used to hold weapon configurations, and bullet pattern setups as well as handling the logic for firing the bullets and setting bullet properties up based on the configuration.
    /// </summary>
    public class WeaponSystem : MonoBehaviour
    {
        /// <summary>
        /// The name assigned to the weapon configuration that is currently equipped.
        /// </summary>
        public string weaponName;

        /// <summary>
        /// The spread that bullets will use for their pattern (when more than one bullet)
        /// </summary>
        [Range(0f, 5f)] public float bulletSpread;

        /// <summary>
        /// The maximum spread to bounce up to when ping pong spread is enabled.
        /// </summary>
        [Range(0f, 5f)]
        public float bulletSpreadPingPongMax;

        /// <summary>
        /// The minimum spread to bounce down to when ping pong spread is enabled.
        /// </summary>
        [Range(0f, 5f)]
        public float bulletSpreadPingPongMin;

        /// <summary>
        /// The speed at which the bullet spread is bounced between.
        /// </summary>
        [Range(1f, 3f)]
        public float spreadPingPongSpeed = 1f;

        /// <summary>
        /// The spacing between bullets when using more than one bullet.
        /// </summary>
        [Range(0f, 5f)]
        public float bulletSpacing;

        /// <summary>
        /// The number of bullets to fire.
        /// </summary>
        [Range(0, 20)]
        public int bulletCount;

        /// <summary>
        /// An amount of randomness to add to bullets when firing them (adds jitter to bullet streams / patterns).
        /// </summary>
        [Range(0f, 5f)]
        public float bulletRandomness;

        /// <summary>
        /// Speed at which bullets travel
        /// </summary>
        [Range(1f, 35f)]
        public float bulletSpeed;

        /// <summary>
        /// 
        /// </summary>
        [Range(0f, 3f)]
        public float weaponFireRate;

        /// <summary>
        /// Offset on the X to position the start of a bullet when fired from a 'gunPoint' transform.
        /// </summary>
        [Range(-3f, 3f)]
        public float weaponXOffset;

        /// <summary>
        /// Offset on the Y to position the start of a bullet when fired from a 'gunPoint' transform.
        /// </summary>
        [Range(-3f, 3f)]
        public float weaponYOffset;

        /// <summary>
        /// The chance a bullet fired from this weapon will have to bounce / ricochet off other colliders.
        /// </summary>
        [Range(0, 100f)]
        public float ricochetChancePercent;

        /// <summary>
        /// The time it takes to reload / change a magazine.
        /// </summary>
        [Range(0f, 10f)]
        public float magazineChangeDelay;

        /// <summary>
        /// The number of bullets in a magazine.
        /// </summary>
        public int magazineSize;

        /// <summary>
        /// The starting ammo for a weapon configuration.
        /// </summary>
        public int startingAmmo;

        /// <summary>
        /// Amount of ammo used in a weapon configuration thus far.
        /// </summary>
        public int ammoUsed;

        /// <summary>
        /// Remaining bullets in the weapon configuration's magazine.
        /// </summary>
        public int magazineRemainingBullets;

        /// <summary>
        /// The target for the weapon to track in 'Turret Track' mode.
        /// </summary>
        public Transform targetToTrack;

        /// <summary>
        /// The rate at which a weapon in 'Turret Track' mode will turn to face it's designated target.
        /// </summary>
        [Range(1f, 15f)]
        public float trackingTurnRate;

        /// <summary>
        /// If enabled, then the turn rate of a weapon system in 'Turret Track' mode whilst tracking its assigned target will be eased (instead of the weapon always instantly facing it's target).
        /// </summary>
        public bool lerpTurnRate;

        /// <summary>
        /// If you are using plain white sprites this color value can be used to dynamically change bullet color in-game.
        /// </summary>
        public Color bulletColour;

        /// <summary>
        /// The texture2D assigned to a weapon configuration - can be used for GUI display of selected weapon for example.
        /// </summary>
        public Texture2D weaponIcon;

        /// <summary>
        /// Enable this to automatically fire without need for input (useful for enemies etc)
        /// </summary>
        public bool autoFire;

        /// <summary>
        /// Enable to bounce the spread value of bullets between the pingpong spread min and max values (causes bullet pattern to 'swing' up and down).
        /// </summary>
        public bool pingPongSpread;

        /// <summary>
        /// Enable if bullets fired from the weapon should allow ricochets (based on percent chance for bullets to ricochet).
        /// </summary>
        public bool richochetsEnabled;

        /// <summary>
        /// Enable if bullets from this weapon should spawn hit effects (like sparks for example) when impacting colliders.
        /// </summary>
        public bool hitEffectEnabled;

        /// <summary>
        /// Enabled if the weapon configuration has limited ammo.
        /// </summary>
        public bool limitedAmmo;

        /// <summary>
        /// Enabled if the weapon is configured to have ammo and use magazines.
        /// </summary>
        public bool usesMagazines;

        /// <summary>
        /// Used to track if a weapon configuration is the first equip or not.
        /// </summary>
        public bool isFirstEquip;

        /// <summary>
        /// Allow the playback of the reloading SFX when reloading.
        /// </summary>
        public bool playReloadingSfx;

        /// <summary>
        /// If enabled, then the empty SFX is played when attempting to shoot with an empty clip.
        /// </summary>
        public bool playEmptySfx;

        /// <summary>
        /// If enabled, the aiming/facing direction is calculated relative to the transform that the WeaponSystem component is placed on. Offset X and Y positioning of bullets is taken into account and applied in this mode.
        /// </summary>
        public bool weaponRelativeToComponent;

        /// <summary>
        /// Duplicates the number of bullets being used and mirrors the extra bullets on the X-axis
        /// </summary>
        public bool mirrorX;

        /// <summary>
        /// If enabled, then every single bullet coming out will count toward ammo usage if limitedAmmo is enabled. (Disable this for shotguns for example so that 10 bullets come out as spray, but only count as one 'bullet' used for ammo).
        /// </summary>
        public bool bulletCountsAsAmmo;

        /// <summary>
        /// The aim angle the weapon system is currently at in radians.
        /// </summary>
        public float aimAngle;

        /// <summary>
        /// The reload SFX clip for the selected weapon configuration
        /// </summary>
        public AudioClip reloadSfxClip;

        /// <summary>
        /// The empty magazine SFX clip for the selected weapon configuration
        /// </summary>
        public AudioClip emptySfxClip;

        /// <summary>
        /// The shot fired SFX clip for the selected weapon configuration
        /// </summary>
        public AudioClip shotFiredClip;

        /// <summary>
        /// The gun point or transform location that bullets are shot / generated from when shooting. This is used if the WeaponSystem configuration is set to relative to gun point mode.
        /// </summary>
        public Transform gunPoint;

        /// <summary>
        /// The different bullet options available. This will be used to select the bullet type pulled from the Object Pool Manager. You can change the bullets here by adding different or custom bullet prefabs to the ObjectPoolManager instance in your scene that map to each of these enum options.
        /// </summary>
        public enum BulletOption
        {
            Spherical,
            TracerHorizontal,
            TurretHorizontal,
            Beam1,
            Beam2,
            Beam3
        }

        public BulletOption bulletOptionType;

        /// <summary>
        /// Allows the user to adjust the direction which the bullets/weapons fire. This makes it easy to create top down horizontal or vertical games.
        /// </summary>
        public enum ShooterType
        {
            Horizonal,
            Vertical,
            FreeAim,
            TargetTracking,
            HorizontalFaceLeft,
            VerticalFaceDown
        }

        public ShooterType shooterDirectionType;

        /// <summary>
        /// Default weapon presets. Feel free to add new ones here! Just don't forget to handle the new bullet presets in the BulletPresetChangedHandler method that is fired with the BulletPresetChanged event.
        /// </summary>
        public enum BulletPresetType
        {
            CrazySpreadPingPong,
            GatlingGun,
            Simple,
            Shotgun,
            WildFire,
            ThreeShotSpread,
            DualSpread,
            ImbaCannon,
            Shower,
            DualAlternating,
            DualMachineGun,
            Tarantula,
            CircleSpray
        }

        public delegate void BulletPresetChangeHandler();

        /// <summary>
        /// Event that fires when a bullet preset is changed.
        /// </summary>
        public event BulletPresetChangeHandler BulletPresetChanged;

        public delegate void WeaponConfigurationChangedHandler(Transform gunPointTransform, int weaponConfigIndex);

        /// <summary>
        /// Event that fires when a Weapon Configuration is changed (weapon changed).
        /// </summary>
        public event WeaponConfigurationChangedHandler WeaponConfigurationChanged;

        public delegate void ReloadStartedHandler();

        public delegate void ReloadFinishedHandler();

        /// <summary>
        /// Event that fires when reloading starts.
        /// </summary>
        public event ReloadStartedHandler ReloadStarted;

        /// <summary>
        /// Event that fires when reloading finishes.
        /// </summary>
        public event ReloadFinishedHandler ReloadFinished;

        /// <summary>
        /// (Legacy - pre version 1.3, but still usable) This property dictates what weapon is selected for the WeaponSystem. Set it to any BulletPresetType Enum value and the event should take care of setting up the weapon for you.
        /// Just ensure that if you add a new Enum value to BulletPresetType, that you create an entry for it in the switch statement in the BulletPresetChangedHandler.
        /// All you need is a reference to your WeaponSystem script, once you have that, you can change you weapon selection from anywhere in your game using this.
        /// </summary>
        public BulletPresetType BulletPreset
        {
            get
            {
                return _bulletPreset;
            }
            set
            {
                if (BulletPreset == value) return;

                // Set a few defaults back whenever the weapon is changed
                pingPongSpread = false;
                weaponXOffset = 0.74f;
                weaponYOffset = 0f;
                gunPoint.transform.localPosition = new Vector2(0.6f, 0f);

                // Set the property and fire off the event if subscribed to.
                _bulletPreset = value;
                if (BulletPresetChanged != null) BulletPresetChanged();
            }
        }

        /// <summary>
        /// The list of weapon configurations on this Weapon System.
        /// </summary>
        public List<WeaponSystemConfiguration> weaponConfigs
        {
            get
            {
                return _weaponConfigs;
            }
            set
            {
                _weaponConfigs = value;
            }
        }

        [SerializeField]
        private List<WeaponSystemConfiguration> _weaponConfigs;

        /// <summary>
        /// Tracking for which bullet preset type is currently selected (legacy / pre version 1.3 used).
        /// </summary>
        private BulletPresetType _bulletPreset;

        /// <summary>
        /// Used to track current cool down status of bullets firing
        /// </summary>
        private float coolDown;

        /// <summary>
        /// Tracks initial spread value of bullets
        /// </summary>
        private float bulletSpreadInitial;

        /// <summary>
        /// The initial value used for spacing bullets
        /// </summary>
        private float bulletSpacingInitial;

        /// <summary>
        /// Value that holds the spread increment of bullets - changes based on how many bullets are being used in bulletCount and the bulletSpread value.
        /// </summary>
        private float bulletSpreadIncrement;

        /// <summary>
        /// Determines how bullets are spaced out based on their spacing value and the number of bullets being used.
        /// </summary>
        private float bulletSpacingIncrement;

        /// <summary>
        /// The currently selected weapon configuration
        /// </summary>
        private int selectedWeaponIndex;

        /// <summary>
        /// The upper index of all weapon configurations - used to determine when to roll over to the first weapon again when switching configurations up.
        /// </summary>
        private int maxWeaponIndex;

        /// <summary>
        /// Flag to determine if weapon configuration is currently reloading or not.
        /// </summary>
        private bool isReloading;

        // Use this for initialization
        void Start()
        {
            ReloadStarted += WeaponSystem_ReloadStarted;
            ReloadFinished += WeaponSystem_ReloadFinished;
            WeaponConfigurationChanged += WeaponSystemWeaponConfigurationChanged;

            // Set a default bullet colour, otherwise bullets will be invisible.
            bulletColour = Color.white;

            // Subscribe to the BulletPresetChanged Event.
            BulletPresetChanged += BulletPresetChangedHandler;

            maxWeaponIndex = weaponConfigs.Count - 1;
            EquipWeaponConfiguration(0); // Equip the first weapon configuration if possible.

        }

        /// <summary>
        /// Fires when weapon is changed.
        /// </summary>
        /// <param name="gunPointTransform">The transform being used as the 'gunpoint' or 'shoot from' point.</param>
        /// <param name="weaponConfigIndex">The weapon configuration 'slot' index to equip.</param>
        void WeaponSystemWeaponConfigurationChanged(Transform gunPointTransform, int weaponConfigIndex)
        {
            gunPoint.transform.position = gunPointTransform.position;
        }

        /// <summary>
        /// Fires when reload completes
        /// </summary>
        void WeaponSystem_ReloadFinished()
        {
            Debug.Log("Reloading finish.");
        }

        /// <summary>
        /// Fires when reload starts
        /// </summary>
        void WeaponSystem_ReloadStarted()
        {
            Debug.Log("Reloading started.");
        }

        /// <summary>
        /// From version 1.3 onward, you can setup weapon "configurations" which are stored in the weaponConfigs List property. You should use this
        /// EquipWeaponConfiguration method to change weapons, passing in the index of the list for the weapon you want to select. Use the in-editor inspector on the WeaponSystem component to setup new configurations and
        /// add them to the inventory/configurations list.
        /// </summary>
        /// <param name="slot">The weapon configuration 'slot' index to equip.</param>
        public void EquipWeaponConfiguration(int slot)
        {
            if (_weaponConfigs.Count <= 0) return;
            var weaponConfig = _weaponConfigs[slot];
            if (weaponConfig == null) return; // Return if an invalid weaponConfig is requested

            var config = _weaponConfigs[slot];
            weaponName = config.weaponName;
            ammoUsed = config.ammoUsed;
            bulletColour = config.bulletColour;
            bulletCount = config.bulletCount;
            bulletRandomness = config.bulletRandomness;
            bulletSpacing = config.bulletSpacing;
            bulletSpeed = config.bulletSpeed;
            bulletSpread = config.bulletSpread;
            bulletSpreadPingPongMax = config.bulletSpreadPingPongMax;
            bulletSpreadPingPongMin = config.bulletSpreadPingPongMin;
            spreadPingPongSpeed = config.spreadPingPongSpeed;
            weaponFireRate = config.weaponFireRate;
            weaponXOffset = config.weaponXOffset;
            weaponYOffset = config.weaponYOffset;
            ricochetChancePercent = config.ricochetChancePercent;
            startingAmmo = config.ammoAvailable;
            autoFire = config.autoFire;
            pingPongSpread = config.pingPongSpread;
            richochetsEnabled = config.richochetsEnabled;
            hitEffectEnabled = config.hitEffectEnabled;
            limitedAmmo = config.limitedAmmo;
            weaponIcon = config.weaponIcon;
            gunPoint = config.gunPoint;
            weaponRelativeToComponent = config.weaponRelativeToComponent;
            bulletCountsAsAmmo = config.bulletCountsAsAmmo;
            usesMagazines = config.usesMagazines;
            magazineChangeDelay = config.magazineChangeDelay;
            magazineRemainingBullets = config.magazineRemainingBullets;
            magazineSize = config.magazineSize;
            isFirstEquip = config.isFirstEquip;
            playEmptySfx = config.playEmptySfx;
            emptySfxClip = config.emptySfxClip;
            reloadSfxClip = config.reloadSfxClip;
            playReloadingSfx = config.playReloadingSfx;
            shotFiredClip = config.shotFiredClip;
            targetToTrack = config.targetToTrack;
            trackingTurnRate = config.trackingTurnRate;
            lerpTurnRate = config.lerpTurnRate;
            mirrorX = config.mirrorX;

            bulletOptionType = config.BulletOptionType;
            shooterDirectionType = config.ShooterType;

            // If the weapon uses magazines we want to setup initial magazine clip with bullets etc the first time the weapon is equipped...
            if (usesMagazines && isFirstEquip && !isReloading && ammoUsed < startingAmmo)
            {
                StartCoroutine(LoadMagazine(true, false));
                isFirstEquip = false;
            }

            if (WeaponConfigurationChanged != null) WeaponConfigurationChanged(gunPoint, slot);
        }

        /// <summary>
        /// Reload magazine coroutine - used for reloading weapon configurations from remaining ammo pool.
        /// </summary>
        /// <param name="instantReload"></param>
        /// <param name="useReloadSfx"></param>
        /// <returns></returns>
        public IEnumerator LoadMagazine(bool instantReload, bool useReloadSfx)
        {
            isReloading = true;

            if (reloadSfxClip != null && useReloadSfx && playReloadingSfx) AudioSource.PlayClipAtPoint(reloadSfxClip, Vector2.zero);

            if (ReloadStarted != null) ReloadStarted();

            if (!instantReload)
            {
                yield return new WaitForSeconds(magazineChangeDelay);
            }
            else
            {
                yield return new WaitForSeconds(0f);
            }

            if (limitedAmmo)
            {
                var currentAmmo = startingAmmo - ammoUsed;
                if (currentAmmo > magazineSize)
                {
                    // Only replenish the bullets we need to replenish in the magazine from the pool of ammo.
                    var bulletsToReplenish = magazineSize - magazineRemainingBullets;
                    magazineRemainingBullets += bulletsToReplenish;
                    ammoUsed += bulletsToReplenish;
                }
                else
                {
                    // Put whatever remaining bullets there are into the magazine
                    magazineRemainingBullets = currentAmmo;
                    ammoUsed += currentAmmo;
                }
            }
            else
            {
                // Unlimited ammo, so just simply reload to max magazine capacity.
                magazineRemainingBullets = magazineSize;
            }

            isReloading = false;
            if (ReloadFinished != null) ReloadFinished();
        }

        /// <summary>
        /// Reload magazine coroutine - used for reloading weapon configurations with a certain number of bullets instead of a full clip.
        /// This might be useful if you wish to have the player reload one bullet at a time for example.
        /// </summary>
        /// <param name="instantReload"></param>
        /// <param name="useReloadSfx"></param>
        /// <param name="amountToReloadWith"></param>
        /// <returns></returns>
        public IEnumerator LoadMagazine(bool instantReload, bool useReloadSfx, int amountToReloadWith)
        {
            isReloading = true;

            if (reloadSfxClip != null && useReloadSfx && playReloadingSfx) AudioSource.PlayClipAtPoint(reloadSfxClip, Vector2.zero);

            if (ReloadStarted != null) ReloadStarted();

            if (!instantReload)
            {
                yield return new WaitForSeconds(magazineChangeDelay);
            }
            else
            {
                yield return new WaitForSeconds(0f);
            }

            if (limitedAmmo)
            {
                var currentAmmo = startingAmmo - ammoUsed;
                if (currentAmmo >= amountToReloadWith)
                {
                    var magUsed = magazineSize - magazineRemainingBullets;

                    // Only replenish the amount of ammo specified in the call to this coroutine into the magazine.
                    if (amountToReloadWith <= magazineSize)
                    {
                        if (amountToReloadWith > magUsed) amountToReloadWith = magUsed;
                        magazineRemainingBullets += amountToReloadWith;
                        ammoUsed += amountToReloadWith;
                    }
                    else
                    {
                        amountToReloadWith = magUsed;
                        magazineRemainingBullets += amountToReloadWith;
                        ammoUsed += amountToReloadWith;
                    }
                }
                else
                {
                    // Put whatever remaining bullets there are into the magazine
                    magazineRemainingBullets = currentAmmo;
                    ammoUsed += currentAmmo;
                }
            }
            else
            {
                // Unlimited ammo, so just simply reload to max magazine capacity.
                magazineRemainingBullets = magazineSize;
            }

            isReloading = false;
            if (ReloadFinished != null) ReloadFinished();
        }

        /// <summary>
        /// (Legacy - pre version 1.3 but still usable). This method should be subscribed to the BulletPresetChanged Event. This event fires whenever the BulletPreset Enum property value changes.
        /// Set up any new BulletPresetType Enum weapon types in here. When you set the public Enum property, this method should fire, and the case statement relevant to your selection should run.
        /// Note: this is the older method of changing weapons. From version 1.3 onward, you can setup weapon "configurations" which are stored in the weaponConfigs List property. You should use the
        /// EquipWeaponConfiguration method to changing weapons, passing in the index of the list for the weapon you want to select. Use the in-editor inspector on the WeaponSystem component to setup new configurations and
        /// add them to the inventory/configurations list.
        /// </summary>
        private void BulletPresetChangedHandler()
        {
            switch (BulletPreset)
            {
                case BulletPresetType.Simple:
                    bulletCount = 1;
                    weaponFireRate = 0.15f;
                    bulletSpacing = 1f;
                    bulletSpread = 0.05f;
                    bulletSpeed = 12f;
                    bulletRandomness = 0.15f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.GatlingGun:
                    bulletCount = 3;
                    weaponFireRate = 0.05f;
                    bulletSpacing = 0.25f;
                    bulletSpread = 0.0f;
                    bulletSpeed = 20f;
                    bulletRandomness = 0.35f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.Shotgun:
                    bulletCount = 8;
                    weaponFireRate = 0.5f;
                    bulletSpacing = 0.5f;
                    bulletSpread = 0.65f;
                    bulletSpeed = 15f;
                    bulletRandomness = 0.65f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.WildFire:
                    bulletCount = 4;
                    weaponFireRate = 0.06f;
                    bulletSpacing = 0.13f;
                    bulletSpread = 0.24f;
                    bulletSpeed = 15f;
                    bulletRandomness = 1f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.Tarantula:
                    bulletSpreadPingPongMin = 1.5f;
                    bulletSpreadPingPongMax = 4f;
                    spreadPingPongSpeed = 2.5f;
                    pingPongSpread = true;
                    bulletCount = 8;
                    weaponFireRate = 0.063f;
                    bulletSpacing = 0.53f;
                    bulletSpread = 0.08f;
                    bulletSpeed = 7.35f;
                    bulletRandomness = 0.0f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.CrazySpreadPingPong:
                    bulletSpreadPingPongMax = 1f;
                    spreadPingPongSpeed = 2.5f;
                    pingPongSpread = true;
                    bulletCount = 7;
                    weaponFireRate = 0.0f;
                    bulletSpacing = 0.08f;
                    bulletSpread = 0.08f;
                    bulletSpeed = 19.35f;
                    bulletRandomness = 0.08f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.DualSpread:
                    bulletCount = 2;
                    weaponFireRate = 0.15f;
                    bulletSpacing = 0.1f;
                    bulletSpread = 0.3f;
                    bulletSpeed = 13f;
                    bulletRandomness = 0.01f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.ThreeShotSpread:
                    bulletCount = 3;
                    weaponFireRate = 0.15f;
                    bulletSpacing = 0.1f;
                    bulletSpread = 0.3f;
                    bulletSpeed = 13f;
                    bulletRandomness = 0.01f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.ImbaCannon:
                    bulletCount = 10;
                    weaponFireRate = 0.02f;
                    bulletSpacing = 0.05f;
                    bulletSpread = 0.08f;
                    bulletSpeed = 25f;
                    bulletRandomness = 0.23f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.Shower:
                    bulletCount = 9;
                    weaponFireRate = 0.02f;
                    bulletSpacing = 0.05f;
                    bulletSpread = 0.7f;
                    bulletSpeed = 21.8f;
                    bulletRandomness = 0.19f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.DualAlternating:
                    bulletSpreadPingPongMax = 1f;
                    spreadPingPongSpeed = 2f;
                    pingPongSpread = true;
                    bulletCount = 2;
                    weaponFireRate = 0.05f;
                    bulletSpacing = 0.24f;
                    bulletSpread = 0.08f;
                    bulletSpeed = 14.5f;
                    bulletRandomness = 0.0f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.DualMachineGun:
                    bulletCount = 2;
                    weaponFireRate = 0.07f;
                    bulletSpacing = 0.53f;
                    bulletSpread = 0.011f;
                    bulletSpeed = 16f;
                    bulletRandomness = 0.02f;
                    limitedAmmo = false;
                    break;

                case BulletPresetType.CircleSpray:
                    weaponXOffset = 0f;
                    weaponYOffset = 0f;
                    bulletCount = 20;
                    weaponFireRate = 0.19f;
                    bulletSpacing = 0f;
                    bulletSpread = 5f;
                    bulletSpeed = 5f;
                    bulletRandomness = 0f;
                    limitedAmmo = false;
                    break;

                default:
                    bulletCount = 1;
                    weaponFireRate = 0.15f;
                    bulletSpacing = 1f;
                    bulletSpread = 0.05f;
                    bulletSpeed = 12f;
                    bulletRandomness = 0.15f;
                    limitedAmmo = false;
                    break;
            }

            mirrorX = false;
        }

        /// <summary>
        /// Calculates when to fire the next bullet(s) based on the fire rate of the weapon configuration.
        /// </summary>
        private void ShootWithCoolDown()
        {
            if (coolDown <= 0f)
            {
                ProcessBullets();
                coolDown = weaponFireRate;
            }
        }

        /// <summary>
        /// Processing of bullets to fire is done here, from ammo usage to angle, number, properties, and color of bullets.
        /// </summary>
        private void ProcessBullets()
        {
            if (!usesMagazines)
            {
                // If we are using limited ammo, (and all bullets in this "shot" count as 1 bullet) we want to only increase ammo usage by 1.
                if (limitedAmmo && !bulletCountsAsAmmo)
                {
                    if (ammoUsed >= startingAmmo) return; // Out of ammo so we return

                    ammoUsed++;
                }
                else if (!limitedAmmo && !bulletCountsAsAmmo)
                {
                    // If we are using unlimited ammo, (and all bullets in this "shot" count as 1 bullet)
                    // don't need to do anything here
                }
            }
            else
            {
                // We're using magazines (and all bullets in this "shot" count as 1 bullet)
                if ((limitedAmmo && !bulletCountsAsAmmo) || (!limitedAmmo && !bulletCountsAsAmmo))
                {
                    if (!CheckBulletsInMagazine())
                    {
                        PlayEmptyMagazineSfx();
                        return; // Out of ammo in magazine so we return
                    }

                    // Take ammo from magazine instead of main ammo pool.
                    magazineRemainingBullets--;
                }
            }

            if (bulletCount > 1)
            {
                bulletSpreadInitial = -bulletSpread / 2;
                bulletSpacingInitial = bulletSpacing / 2;
                bulletSpreadIncrement = bulletSpread / (bulletCount - 1);
                bulletSpacingIncrement = bulletSpacing / (bulletCount - 1);
            }
            else
            {
                bulletSpreadInitial = 0f;
                bulletSpacingInitial = 0f;
                bulletSpreadIncrement = 0f;
                bulletSpacingIncrement = 0f;
            }

            //Shooting audio
            if (shotFiredClip != null) AudioSource.PlayClipAtPoint(shotFiredClip, Vector2.zero);

            // For each 'gun' attachment the player has we'll setup each bullet accordingly...
            for (var i = 0; i < bulletCount; i++)
            {
                if (!usesMagazines)
                {
                    // If we are using limited ammo, (and each bullet count as 1 bullet) we want increase ammo usage by 1 for every bullet fired.
                    if (limitedAmmo && bulletCountsAsAmmo)
                    {
                        if (ammoUsed >= startingAmmo) return; // Out of ammo so we return

                        ammoUsed++;
                    }
                    else if (!limitedAmmo && bulletCountsAsAmmo)
                    {
                        // If we are using unlimited ammo
                        // don't need to do anything here
                    }
                }
                else
                {
                    // We're using magazines (and each bullet count as 1 bullet) we want increase ammo usage by 1 for every bullet fired.
                    if ((limitedAmmo && bulletCountsAsAmmo) || (!limitedAmmo && bulletCountsAsAmmo))
                    {
                        if (!CheckBulletsInMagazine())
                        {
                            PlayEmptyMagazineSfx();
                            return; // Out of ammo in magazine so we return
                        }

                        // Take ammo from magazine instead of main ammo pool.
                        magazineRemainingBullets--;
                    }
                }

                var bullet = GetBulletFromPool();
                var bulletComponent = (Bullet)bullet.GetComponent(typeof(Bullet));

                var offsetX = Mathf.Cos(aimAngle - Mathf.PI / 2) * (bulletSpacingInitial - i * bulletSpacingIncrement);
                var offsetY = Mathf.Sin(aimAngle - Mathf.PI / 2) * (bulletSpacingInitial - i * bulletSpacingIncrement);

                bulletComponent.directionAngle = aimAngle + bulletSpreadInitial + i * bulletSpreadIncrement;
                bulletComponent.speed = bulletSpeed;

                // Setup the point at which bullets need to be placed based on all the parameters
                var initialPosition = gunPoint.position + (gunPoint.transform.forward * (bulletSpacingInitial - i * bulletSpacingIncrement));
                var bulletPosition = new Vector3(initialPosition.x + offsetX + Random.Range(0f, 1f) * bulletRandomness - bulletRandomness / 2,
                    initialPosition.y + offsetY + Random.Range(0f, 1f) * bulletRandomness - bulletRandomness / 2, 0f);

                bullet.transform.position = bulletPosition;

                bulletComponent.bulletXPosition = bullet.transform.position.x;
                bulletComponent.bulletYPosition = bullet.transform.position.y;

                // Initial chance to ricochet as the bullet comes out. If the bullet bounces again, this will be determined on the next bullet collision.
                bulletComponent.ricochetChancePercent = ricochetChancePercent;
                bulletComponent.canRichochet = bulletComponent.GetRicochetChance();
                bulletComponent.useHitEffects = hitEffectEnabled;

                // Activate the bullet to get it going
                bullet.SetActive(true);

                // Set the bullet colour using the renderer that we cached when the bullet was first created at the start of the scene. This is easy and accurate if we have a white/semi-transparent bullet sprite
                if (bulletComponent.bulletSpriteRenderer != null) bulletComponent.bulletSpriteRenderer.color = bulletColour;

                // If mirror X is enabled, then more bullets will be spawned, but mirrored on the other size (horizontally / X-axis).
                if (mirrorX)
                {
                    var flipAimAngle = GetFlippedXAngle(aimAngle);
                    var bulletMirrored = GetBulletFromPool();
                    var bulletMirroredComponent = (Bullet)bulletMirrored.GetComponent(typeof(Bullet));

                    var bulletMirroredoffsetX = Mathf.Cos(flipAimAngle - Mathf.PI / 2) * (bulletSpacingInitial - i * bulletSpacingIncrement);
                    var bulletMirroredoffsetY = Mathf.Sin(flipAimAngle - Mathf.PI / 2) * (bulletSpacingInitial - i * bulletSpacingIncrement);

                    var flippedDirectionAngle = flipAimAngle + bulletSpreadInitial + i * bulletSpreadIncrement;
                    bulletMirroredComponent.directionAngle = flippedDirectionAngle;
                    bulletMirroredComponent.speed = bulletSpeed;

                    // Setup the point at which bullets need to be placed based on all the parameters
                    var bulletMirroredinitialPosition = gunPoint.position - (gunPoint.transform.forward * (bulletSpacingInitial - i * bulletSpacingIncrement));
                    var bulletMirroredbulletPosition = new Vector3(initialPosition.x - bulletMirroredoffsetX + Random.Range(0f, 1f) * bulletRandomness - bulletRandomness / 2,
                        bulletMirroredinitialPosition.y - bulletMirroredoffsetY + Random.Range(0f, 1f) * bulletRandomness - bulletRandomness / 2, 0f);

                    bulletMirrored.transform.position = bulletMirroredbulletPosition;

                    bulletMirroredComponent.bulletXPosition = bulletMirrored.transform.position.x;
                    bulletMirroredComponent.bulletYPosition = bulletMirrored.transform.position.y;

                    // Initial chance to ricochet as the bullet comes out. If the bullet bounces again, this will be determined on the next bullet collision.
                    bulletMirroredComponent.ricochetChancePercent = ricochetChancePercent;
                    bulletMirroredComponent.canRichochet = bulletMirroredComponent.GetRicochetChance();
                    bulletMirroredComponent.useHitEffects = hitEffectEnabled;

                    // Activate the bullet to get it going
                    bulletMirrored.SetActive(true);

                    // Set the bullet colour using the renderer that we cached when the bullet was first created at the start of the scene. This is easy and accurate if we have a white/semi-transparent bullet sprite
                    if (bulletMirroredComponent.bulletSpriteRenderer != null) bulletMirroredComponent.bulletSpriteRenderer.color = bulletColour;
                }
            }
        }

        /// <summary>
        /// Returns the flipped horizontal (X) angle of the input angle in radians.
        /// </summary>
        /// <param name="aimAngle"></param>
        /// <returns>The flipped angle</returns>
        private float GetFlippedXAngle(float inputAngle)
        {
            float flipAimAngle;
            if (inputAngle >= 0)
            {
                flipAimAngle = Mathf.PI - inputAngle;
            }
            else
            {
                flipAimAngle = -(Mathf.PI) - inputAngle;
            }

            return flipAimAngle;
        }

        /// <summary>
        /// Fetch a bullet from the ObjectPoolManager instance depending on what BulletOption type enum is selected for the selected weapon configuration. The pool will generate a new bullet if there are no available bullets to pull from the pool.
        /// </summary>
        /// <returns></returns>
        private GameObject GetBulletFromPool()
        {
            GameObject bullet;

            // Pull a bullet object from our pool based on current bullet Enum selection.
            switch (bulletOptionType)
            {
                case BulletOption.Spherical:
                    bullet = ObjectPoolManager.instance.GetUsableSphereBullet();
                    break;

                case BulletOption.TracerHorizontal:
                    bullet = ObjectPoolManager.instance.GetUsableStandardHorizontalBullet();
                    break;

                case BulletOption.TurretHorizontal:
                    bullet = ObjectPoolManager.instance.GetUsableTurretBullet();
                    break;

                case BulletOption.Beam1:
                    bullet = ObjectPoolManager.instance.GetUsableBeam1Bullet();
                    break;

                case BulletOption.Beam2:
                    bullet = ObjectPoolManager.instance.GetUsableBeam2Bullet();
                    break;

                case BulletOption.Beam3:
                    bullet = ObjectPoolManager.instance.GetUsableBeam3Bullet();
                    break;

                default:
                    bullet = ObjectPoolManager.instance.GetUsableSphereBullet();
                    break;
            }

            return bullet;
        }

        /// <summary>
        /// Simple method call to play the weapon empty sfx clip.
        /// </summary>
        private void PlayEmptyMagazineSfx()
        {
            if (emptySfxClip != null && playEmptySfx) AudioSource.PlayClipAtPoint(emptySfxClip, Vector2.zero);
        }

        /// <summary>
        /// Returns true if there were still bullets in the magazine
        /// </summary>
        /// <returns></returns>
        private bool CheckBulletsInMagazine()
        {
            if (usesMagazines)
            {
                if (magazineRemainingBullets > 0)
                {
                    return true;
                }
            }
            return false;
        }

        // Update is called once per frame
        void Update()
        {
            // Handle switching weapons with scroll wheel
            if (Input.GetAxis("Mouse ScrollWheel") > 0)
            {
                // Return if we don't have any configurations setup.
                if (_weaponConfigs.Count <= 0) return;

                // Save our current weapon's used ammo property as well as magazine usage if applicable. We also store whether the weapon has been equipped for the first time or not
                StoreCurrentWeaponIndexAmmoUsedValue();
                StoreCurrentWeaponIndexMagazineUsage();
                StoreFirstEquippedStatus();

                if (selectedWeaponIndex < maxWeaponIndex)
                {
                    selectedWeaponIndex = (selectedWeaponIndex + 1);
                }
                else
                {
                    // rollover to the first weapon index
                    selectedWeaponIndex = 0;
                }

                // Equip the selected weapon configuration
                EquipWeaponConfiguration(selectedWeaponIndex);
            }
            if (Input.GetAxis("Mouse ScrollWheel") < 0)
            {
                // Return if we don't have any configurations setup.
                if (_weaponConfigs.Count <= 0) return;

                // Save our current weapon's used ammo property, as well as magazine usage if applicable. We also store whether the weapon has been equipped for the first time or not
                StoreCurrentWeaponIndexAmmoUsedValue();
                StoreCurrentWeaponIndexMagazineUsage();
                StoreFirstEquippedStatus();

                if (selectedWeaponIndex >= 1)
                {
                    selectedWeaponIndex = (selectedWeaponIndex - 1);
                }
                else
                {
                    // rollback to the last weapon index
                    selectedWeaponIndex = maxWeaponIndex;
                }

                // Equip the selected weapon configuration
                EquipWeaponConfiguration(selectedWeaponIndex);
            }

            var facingDirection = Vector2.zero;

            // We have three modes - horizontal, vertical and free. Each is a different case based on a dropdown Enum selector on the WeaponSystem script.
            // Horizontal is like a sideways scrolling horizontal shooter, vertical is the same, but with the player locked facing upward instead of right, and free allows the player to turn in any direction based on the mouse position.
            switch (shooterDirectionType)
            {
                case ShooterType.Horizonal:
                    // Rotate the player to face horizontally right
                    facingDirection = Vector2.right;
                    break;

                case ShooterType.Vertical:
                    // Rotate the player to face vertically up
                    facingDirection = Vector2.up;
                    break;

                case ShooterType.FreeAim:
                    // Get the world position of the mouse cursor and set facing direction to that minus the player's current position.
                    var worldMousePosition = Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0f));
                    // Calculate based on whether this weapon configuration is set relative to the WeaponSystem object, or the assigned gunpoint object.
                    if (weaponRelativeToComponent)
                    {
                        facingDirection = worldMousePosition - gunPoint.transform.position;
                    }
                    else
                    {
                        facingDirection = worldMousePosition - transform.position;
                    }
                    break;

                case ShooterType.TargetTracking:
                    // Face the specified target to track.
                    // Calculate based on whether this weapon configuration is set relative to the WeaponSystem object, or the assigned gunpoint object.
                    if (weaponRelativeToComponent)
                    {
                        facingDirection = targetToTrack.position - gunPoint.transform.position;
                    }
                    else
                    {
                        facingDirection = targetToTrack.position - transform.position;
                    }
                    break;

                case ShooterType.HorizontalFaceLeft:
                    // Rotate the player to face horizontally left
                    facingDirection = -Vector2.right;
                    break;

                case ShooterType.VerticalFaceDown:
                    // Rotate the player to face vertically up
                    facingDirection = -Vector2.up;
                    break;

                default:
                    // Default the player to face horizontally right if no selection is made
                    facingDirection = Vector2.right;
                    break;
            }

            CalculateAimAndFacingAngles(facingDirection);
            HandleShooting();

            if (Input.GetKeyDown(KeyCode.R) && !isReloading && usesMagazines && (magazineRemainingBullets < magazineSize) && (ammoUsed < startingAmmo))
            {
                StartCoroutine(LoadMagazine(false, true));
            }

            if (Input.GetKeyDown(KeyCode.E) && !isReloading && usesMagazines && (magazineRemainingBullets < magazineSize) && (ammoUsed < startingAmmo))
            {
                StartCoroutine(LoadMagazine(false, true, 1));
            }

            if (pingPongSpread)
            {
                bulletSpread = Mathf.PingPong(Time.time * spreadPingPongSpeed, bulletSpreadPingPongMax - bulletSpreadPingPongMin) + bulletSpreadPingPongMin;
            }

            // Set the weapon offset position - the gunpoint transform needs to be a child of the player gameobject's transform, if in "relative to object" mode.
            if (weaponRelativeToComponent)
            {
                // No offset positioning of gunpoint is done if the weapon configuration is in "relative to gunpoint" mode.
            }
            else
            {
                gunPoint.transform.localPosition = new Vector3(weaponXOffset, weaponYOffset, 0f);
            }
        }

        /// <summary>
        /// Flags the selected weapon as the first equipped / starting weapon configuration - generally only called at the instantiation of a WeaponSystem component.
        /// </summary>
        private void StoreFirstEquippedStatus()
        {
            if (_weaponConfigs[selectedWeaponIndex] != null) _weaponConfigs[selectedWeaponIndex].isFirstEquip = isFirstEquip;
        }

        /// <summary>
        /// Stores the weapon ammo status for the currently selected weapon configuration, when switching to another weapon config.
        /// </summary>
        private void StoreCurrentWeaponIndexAmmoUsedValue()
        {
            if (_weaponConfigs[selectedWeaponIndex] != null) _weaponConfigs[selectedWeaponIndex].ammoUsed = ammoUsed;
        }

        private void StoreCurrentWeaponIndexMagazineUsage()
        {
            var weaponConfigRef = _weaponConfigs[selectedWeaponIndex];
            if (weaponConfigRef != null)
            {
                weaponConfigRef.magazineRemainingBullets = magazineRemainingBullets;
                //weaponConfigRef.usedMagazines = usedMagazines;
            }
        }

        /// <summary>
        /// Change weapon cooldown timer down so it gets closer to being ready to fire again based on cooldown time and handle player shooting controls input
        /// </summary>
        private void HandleShooting()
        {
            coolDown -= Time.deltaTime;

            if (Input.GetMouseButton(0) && shooterDirectionType != ShooterType.TargetTracking)
            {
                if (isReloading) return;
                ShootWithCoolDown();
            }
            else
            {
                if (autoFire)
                {
                    if (isReloading) return;
                    ShootWithCoolDown();
                }
            }
        }

        /// <summary>
        /// Calculate aim angle and other settings that apply to all ShooterType orientations
        /// </summary>
        /// <param name="facingDirection"></param>
        private void CalculateAimAndFacingAngles(Vector2 facingDirection)
        {
            if (lerpTurnRate)
            {
                var wantedAimAngle = Mathf.Atan2(facingDirection.y, facingDirection.x);
                var lerpedAimAngle = Mathf.LerpAngle(aimAngle, wantedAimAngle, Time.deltaTime * trackingTurnRate);
                aimAngle = lerpedAimAngle;
            }
            else
            {
                aimAngle = Mathf.Atan2(facingDirection.y, facingDirection.x);
                if (aimAngle < 0f)
                {
                    aimAngle = Mathf.PI * 2 + aimAngle;
                }
            }

            // Rotate the player to face the direction of the mouse cursor (the object with the weaponsystem component attached, or, if the weapon configuration specifies relative to the gunpoint, rotate the gunpoint instead.
            if (weaponRelativeToComponent)
            {
                if (lerpTurnRate)
                {
                    var newRot = new Vector3(0.0f, 0.0f, aimAngle * Mathf.Rad2Deg);
                    gunPoint.transform.rotation = Quaternion.Lerp(gunPoint.transform.rotation, Quaternion.Euler(newRot.x, newRot.y, newRot.z), Time.deltaTime * trackingTurnRate);
                }
                else
                {
                    gunPoint.transform.eulerAngles = new Vector3(0.0f, 0.0f, aimAngle * Mathf.Rad2Deg);
                }
            }
            else
            {
                if (lerpTurnRate)
                {
                    var newRot = new Vector3(0.0f, 0.0f, aimAngle * Mathf.Rad2Deg);
                    transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(newRot.x, newRot.y, newRot.z), Time.deltaTime * trackingTurnRate);
                }
                else
                {
                    transform.eulerAngles = new Vector3(0.0f, 0.0f, aimAngle * Mathf.Rad2Deg);
                }
            }
        }
    }
}