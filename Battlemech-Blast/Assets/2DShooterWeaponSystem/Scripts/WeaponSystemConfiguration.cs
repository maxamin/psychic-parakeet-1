using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using ShootingSystem;
/// <summary>
/// Data class for weapon configurations held by the main WeaponSystem component. It keeps individual "weapon configuration" data for each weapon configuration you create using an instance of the WeaponSystem component. This allows you to create an inventory of guns/weapons for a player for example,
/// and within the WeaponSystem component, you are able to iterate through a list of these configurations and easily change between "guns" or weapon configurations. Each property in this class will map back to a matching property on the WeaponSystem component,
/// so when you switch weapons, each field from this WeaponSystemConfiguration instance is mapped to a field on the WeaponSystem instance. Bullets are then fired from the WeaponSystem instance and all the fields that were defined in this class, are then applied to the bullets.
/// </summary>
[System.Serializable]
public class WeaponSystemConfiguration  {

    public string weaponName;

    public float bulletSpread;

    public float bulletSpreadPingPongMax, bulletSpreadPingPongMin;

    public float spreadPingPongSpeed = 1f;

    public float bulletSpacing;

    public int bulletCount;

    public float bulletRandomness;

    public float bulletSpeed;

    public float weaponFireRate;

    public float weaponXOffset;

    public float weaponYOffset;

    public float ricochetChancePercent;

    public float magazineChangeDelay;

    public Color bulletColour;

    public Texture2D weaponIcon;

    public int magazineSize;

    public int magazineRemainingBullets;

    public int ammoAvailable;

    public int ammoUsed;

    public bool autoFire, pingPongSpread, richochetsEnabled, hitEffectEnabled, limitedAmmo, usesMagazines, isFirstEquip, mirrorX;

    public bool bulletCountsAsAmmo;

    public bool playReloadingSfx, playEmptySfx;

    public bool weaponRelativeToComponent;

    public float trackingTurnRate;

    public bool lerpTurnRate;

    public Transform targetToTrack;

    public AudioClip reloadSfxClip, emptySfxClip, shotFiredClip;

    public Transform gunPoint;

    public WeaponSystem.ShooterType ShooterType;

    public WeaponSystem.BulletOption BulletOptionType;
}
