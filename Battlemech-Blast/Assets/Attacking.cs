using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class Attacking : MonoBehaviour
{
    public static Attacking instance;

    //GUI
    Text t_currentAmmo;
    public GameObject bullet;
    public Transform firePoint;
    Animator anim;



    public int maxReloadAmmo;
    private int maxAmmo = 100;
    int currentAmmo = 0;



    public float reloadDelay;
    public float shootForce;
    private float timeToFire;
    private Quaternion rotation;
    //public GameObject[] muzzleEffect;
    //public GameObject muzzle2DLight;


    public bool isFiring;



    Action attackAction;


    void Awake()
    {
        instance = this;
    }

    void Start()
    {

        anim = GetComponent<Animator>();
        t_currentAmmo = GameHandler.instance.currentAmmo;

        attackAction += ShootingProcess;
        GameHandler.instance.weaponContainer.GetChild(0).GetComponent<WeaponUnit>().isSelected = true;

    }
    public void SwitchWeapon()
    {
        if (Input.GetKeyDown(KeyCode.Alpha2) && !GameHandler.instance.weaponContainer.GetChild(0).GetComponent<WeaponUnit>().isSelected)
        {
            attackAction -= KnifeAttack;
            attackAction += ShootingProcess;
            for (int i = 0; i < GameHandler.instance.weaponContainer.childCount; i++)
            {
                GameHandler.instance.weaponContainer.GetChild(i).GetComponent<WeaponUnit>().isSelected = false;
            }
            GameHandler.instance.weaponContainer.GetChild(0).GetComponent<WeaponUnit>().isSelected = true;
        }
        else if (Input.GetKeyDown(KeyCode.Alpha3) && !GameHandler.instance.weaponContainer.GetChild(1).GetComponent<WeaponUnit>().isSelected)
        {
            attackAction -= ShootingProcess;
            attackAction += KnifeAttack;
            for (int i = 0; i < GameHandler.instance.weaponContainer.childCount; i++)
            {
                GameHandler.instance.weaponContainer.GetChild(i).GetComponent<WeaponUnit>().isSelected = false;
            }
            GameHandler.instance.weaponContainer.GetChild(1).GetComponent<WeaponUnit>().isSelected = true;

        }

    }
    void Update()
    {

        SwitchWeapon();

        if (attackAction == KnifeAttack)
        {
            if (Input.GetMouseButtonDown(0) && knifeTimer <= 0)
            {
                attackAction.Invoke();
                knifeTimer = knifeShootTimeAmount;

            }
            else
            {
                knifeTimer -= Time.deltaTime;
            }
        }
        else if (attackAction == ShootingProcess)
        {
            if (Input.GetMouseButton(0))
            {
                attackAction.Invoke();
            }
            else
            {
                isFiring = false;
            }
        }

        if (Input.GetKeyDown(KeyCode.R))
        {
            StartCoroutine(Reloading(reloadDelay));
        }
        t_currentAmmo.text = currentAmmo.ToString() + " / " + maxAmmo.ToString();

    }
    public float knifeShootTimeAmount;
    float knifeTimer;
    public Transform knifeHurtPoint;
    public float knifeHurtPointRadius;

    public LayerMask TargetLayer;

    void KnifeAttack()
    {

        Debug.Log("you hit knife");
        anim.SetTrigger("Stab");
        Collider2D target = Physics2D.OverlapCircle(knifeHurtPoint.position, knifeHurtPointRadius, TargetLayer);
        if (target != null)
        {
            HealthSystem hp = target.GetComponent<HealthSystem>();
            //hp.LoseHealth(4);

        }

    }
    void ShootingProcess()
    {
        if (currentAmmo > 0)
        {
            if (Time.time >= timeToFire)
            {
                isFiring = true;


                //anim.SetBool("Idle", false);
                //anim.SetTrigger("Attack");

                Vector2 lookDir = (Camera.main.ScreenToWorldPoint(Input.mousePosition) - transform.position).normalized;

                int dir = (lookDir.x > 0) ? 1 : -1;
                float angle = Mathf.Atan2(lookDir.y * dir, lookDir.x * dir) * Mathf.Rad2Deg;


                Vector2 spawnPos = firePoint.position;
                rotation = Quaternion.Euler(rotation.x, rotation.y, angle);
                GameObject projectile = Instantiate(bullet, spawnPos, rotation);




                projectile.transform.localRotation = rotation;
                Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
                rb.AddForce(firePoint.right * dir * shootForce, ForceMode2D.Impulse);
                //projectile.transform.GetChild(0).GetComponent<TrailRenderer>().startColor = startColorKey;
                //projectile.transform.GetChild(0).GetComponent<TrailRenderer>().endColor = endColorKey;

                //timeToFire = Time.time + 1 / projectile.GetComponent<Bullet>().fireRate;
                currentAmmo -= 1;
            }


        }
        else
        {
            //anim.SetBool("Idle", true);

        }


    }
    IEnumerator Reloading(float delayAmount)
    {
        yield return new WaitForSeconds(delayAmount);
        if (maxAmmo > currentAmmo)
        {
            currentAmmo += (maxAmmo > maxReloadAmmo) ? maxReloadAmmo : maxAmmo;
            maxAmmo -= (maxAmmo > maxReloadAmmo) ? maxReloadAmmo : maxAmmo;
        }
        if (currentAmmo > maxAmmo)
        {
            currentAmmo += maxAmmo;
            maxAmmo -= maxAmmo;
            if (currentAmmo > maxReloadAmmo)
            {
                int remainingAmmo = currentAmmo - maxReloadAmmo;
                maxAmmo += remainingAmmo;
                currentAmmo = currentAmmo - remainingAmmo;
            }
        }
    }

    public void GetAmmo(int ammo)
    {
        if (currentAmmo < maxReloadAmmo)
        {
            currentAmmo += ammo;
        }
        else if (currentAmmo > maxReloadAmmo || currentAmmo == maxReloadAmmo)
        {
            int difference = (currentAmmo + ammo) - maxReloadAmmo;
            currentAmmo = maxReloadAmmo;
            maxAmmo += difference;
        }

    }

    private void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(knifeHurtPoint.position, knifeHurtPointRadius);
    }
}
