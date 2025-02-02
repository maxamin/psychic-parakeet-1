using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;

public class LaserGun : Fire, IWeapon, IFireable
{
    private PlayerAttackController attackController;

    [SerializeField] private float m_Damage;
    [SerializeField] private float m_Accuracy;
    [SerializeField] private float m_Speed;
    [SerializeField] private float m_ReloadTime;
    [SerializeField] private float m_FireRate;
    [SerializeField] private int m_MaxCapacity;
    [SerializeField] private int m_Capacity;
    [SerializeField] private bool m_isFiring;
    public int m_CurrentAmmo;
    private float timeToFire;
    private bool m_isReloading = false;

    #region Interface_Variables

    public float Damage => m_Damage;
    public float Accuracy => m_Accuracy;
    public float Speed => m_Speed;
    public float FireRate => m_FireRate;
    public float ReloadTime => m_ReloadTime;
    public bool IsFiring => m_isFiring;
    public int MaxCapacity => m_MaxCapacity;
    public int Capacity => m_Capacity;
    public int CurrentAmmo { get => m_CurrentAmmo; }

    #endregion

    private void Start()
    {
        client = this;
        m_CurrentAmmo = m_Capacity;


        attackController = transform.parent.GetComponent<WeaponManager>().attackController;
    }

    private void Update()
    {


    }


    public override void Trigger()
    {
        //Debug.Log("Laser gun firing");
    }

    public void Execute()
    {
        if (attackController.IsRiffleShooting())
        {
            m_isFiring = true;

            if (client.IsFiring)
            {
                if (m_CurrentAmmo > 0)
                {
                    if (Time.time >= timeToFire)
                    {
                        Trigger();
                        attackController.FireWeapon();
                        timeToFire = Time.time + 1 / m_FireRate;
                        m_CurrentAmmo -= 1;
                    }
                }
            }
        }
        else
        {
            m_isFiring = false;
        }
    }
    public void Reload()
    {
        if (!m_isReloading)
        {
            StartCoroutine(ReloadingCoroutine());
        }
    }

    public override void ReloadAmmo(ref int m_CurrentAmmo, ref int m_Capacity, int m_MaxCapacity)
    {
        base.ReloadAmmo(ref m_CurrentAmmo, ref m_Capacity, m_MaxCapacity);

    }
    public override void AddAmmo(int ammo, ref int m_CurrentAmmo, ref int m_Capacity, int m_MaxCapacity)
    {
        base.AddAmmo(ammo, ref m_CurrentAmmo, ref m_Capacity, m_MaxCapacity);
    }
    public void IncreaseAmmo(int amount)
    {
        AddAmmo(amount, ref m_CurrentAmmo, ref m_Capacity, m_MaxCapacity);
    }
    IEnumerator ReloadingCoroutine()
    {
        m_isReloading = true;
        yield return new WaitForSeconds(ReloadTime);
        ReloadAmmo(ref m_CurrentAmmo, ref m_Capacity, m_MaxCapacity);
        Debug.Log("Ammo reloaded");
        m_isReloading = false;
    }


}
