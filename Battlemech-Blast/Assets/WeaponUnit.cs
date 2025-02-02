using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class WeaponUnit : MonoBehaviour
{
    public static WeaponUnit instance;

    public enum WeaponType
    {
        Pistol,
        LaserGun,
        Rocket,
        Riffle,
        Sward,
        Explosive,
        Throwable
    }

    public GameObject bulletPrefab;
    public IWeapon weaponClient;
    public WeaponType weaponUnit;
    public Image weaponIcon;
    public bool isSelected;

    private void Awake()
    {
        instance = this;
        weaponClient = GetComponent<IWeapon>();
    }
     
}
