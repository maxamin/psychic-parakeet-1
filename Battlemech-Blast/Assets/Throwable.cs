using System.Collections;
using System.Collections.Generic;
using UnityEditor.PackageManager;
using UnityEngine;

public class Throwable : Weapon, IWeapon
{

    private PlayerAttackController attackController;
    private WeaponUnit weaponUnit;
    private ThrowableWeapon weapon;


    [SerializeField] private int m_CurrentAmmo;
    [SerializeField] private int m_Capacity;
    public int CurrentAmmo { get => m_CurrentAmmo; set => m_CurrentAmmo = value; }
    public int Capacity => m_Capacity;

    void Start()
    {
        attackController = transform.parent.GetComponent<WeaponManager>().attackController;
        weaponUnit = GetComponent<WeaponUnit>();
        weapon = weaponUnit.bulletPrefab.GetComponent<ThrowableWeapon>();

        m_CurrentAmmo = m_Capacity;


    }


    void Update()
    {
    }
    public void Execute()
    {
        if (attackController.IsThrowingWeapon())
        {

            if (m_CurrentAmmo > 0)
            {
                Trigger();
                attackController.ThrowWeapon();
                m_CurrentAmmo -= 1;
            }
        }
    }

    public void IncreaseAmmo(int amount)
    {
        throw new System.NotImplementedException();

    }

    public void Reload()
    {
        throw new System.NotImplementedException();

    }

    public override void Trigger()
    {
        Debug.Log("Weapon Thrown");
    }
}
