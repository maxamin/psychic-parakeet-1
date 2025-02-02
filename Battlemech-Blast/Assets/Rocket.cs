using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rocket : Fire, IWeapon, IFireable, IExplodeable
{

    private PlayerAttackController attackController;

    [SerializeField] private float m_Damage;
    [SerializeField] private float m_Accuracy;
    [SerializeField] private float m_Speed;
    [SerializeField] private float m_ReloadTime;
    [SerializeField] private float m_Mass;
    [SerializeField] private float m_Radius = 5f;
    [SerializeField] private float m_FireRate;
    [SerializeField] private int m_Capacity;
    [SerializeField] private int m_MaxCapacity;
    [SerializeField] private bool m_isFiring;
    private int m_CurrentAmmo;


    private bool m_isLunched = false;
    private bool m_isReloading = false;
    public bool m_isLanded { get; private set; }
    private float m_LandingTime = 3.5f;
    private float timeToFire;

    #region Interface_Variables

    public float Damage => m_Damage;
    public float Accuracy => m_Accuracy;
    public float Speed => m_Speed;
    public float FireRate => m_FireRate;
    public float ReloadTime => m_ReloadTime;
    public float Radius => m_Radius;
    public float Mass => m_Mass;
    public bool IsFiring => m_isFiring;
    public int Capacity => m_Capacity;
    public int MaxCapacity => m_MaxCapacity;
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

        if (m_LandingTime <= 0)
        {
            m_isLanded = true;
        }
        if (m_isLunched)
        {
            Lunch();
        }
        if (m_isLanded)
        {
            Landed();
        }


    }

    public void Explode()
    {
        Debug.Log("Your Rocket destroyed everything at this Radius: " + m_Radius + "m²");
        m_LandingTime = 3.5f;
        m_isLanded = false;
        m_isLunched = false;
    }

    public override void Trigger()
    {
        if (!m_isLunched)
        {
            m_isFiring = true;

            if (client.IsFiring)
            {
                if (m_CurrentAmmo > 0)
                {
                    if (Time.time >= timeToFire)
                    {
                        Debug.Log("You fired a Rocket");
                        attackController.FireWeapon();
                        timeToFire = Time.time + 1 / m_FireRate;
                        m_CurrentAmmo -= 1;
                        m_isLunched = true;
                    }
                }
            }
        }
    }
    private void Lunch()
    {
        m_LandingTime -= Time.deltaTime;
    }
    private void Landed()
    {
        Debug.Log("Your rocket has landed");
        Explode();
    }

    public void Execute()
    {

        if (attackController.IsRiffleShooting())
            Trigger();
        else
            m_isFiring = false;

    }
    public override void AddAmmo(int ammo, ref int m_CurrentAmmo, ref int m_Capacity, int m_MaxCapacity)
    {
        base.AddAmmo(ammo, ref m_CurrentAmmo, ref m_Capacity, m_MaxCapacity);
    }
    public override void ReloadAmmo(ref int m_CurrentAmmo,ref int m_Capacity, int m_MaxCapacity)
    {
        base.ReloadAmmo(ref m_CurrentAmmo,ref m_Capacity, m_MaxCapacity);
    }

    public void IncreaseAmmo(int amount)
    {
        AddAmmo(amount, ref m_CurrentAmmo, ref m_Capacity, m_MaxCapacity);
    }
    public void Reload()
    {
        if (!m_isReloading)
        {
            StartCoroutine(ReloadingCoroutine());
        }
    }

    IEnumerator ReloadingCoroutine()
    {
        m_isReloading = true;
        yield return new WaitForSeconds(ReloadTime);
        ReloadAmmo(ref m_CurrentAmmo,ref m_Capacity, m_MaxCapacity);
        Debug.Log("Ammo reloaded");
        m_isReloading = false;
    }

}
