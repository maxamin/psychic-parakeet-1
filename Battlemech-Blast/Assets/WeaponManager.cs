using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class WeaponManager : MonoBehaviour
{
    private List<WeaponUnit> weaponList = new List<WeaponUnit>();
    private WeaponUnit currentWeapon;
    public PlayerAttackController attackController;
    public PlayerTester tester;


    private void Start()
    {
        this.transform.GetChild(0).GetComponent<WeaponUnit>().isSelected = true;
        InitializeButtonListener();
        CheckCurrentWeapon();
    }

    private void Update()
    {
        HoverWeaponUnit();
        NewSwitchWeapon();
    }

    public void NewSwitchWeapon()
    {
        for (int i = 0; i < transform.childCount; i++)
        {
            WeaponUnit unit = transform.GetChild(i).GetComponent<WeaponUnit>();
            if (Input.GetKeyDown(KeyCode.Alpha1 + i) && !unit.isSelected)
            {
                if (unit == null)
                    return;

                SelectUnit(unit);
                CheckCurrentWeapon();
            }
        }
    }

    void SelectUnit(WeaponUnit unit)
    {
        //Unselect all weapon units
        for (int k = 0; k < transform.childCount; k++)
        {
            transform.GetChild(k).GetComponent<WeaponUnit>().isSelected = false;
        }
        //Select the current weapon unit
        unit.isSelected = true;

    }


    //Check and return the available weapon 
    public void CheckCurrentWeapon()
    {

        for (int i = 0; i < transform.childCount; i++)
        {
            if (transform.GetChild(i).GetComponent<WeaponUnit>().isSelected)
            {
                currentWeapon = transform.GetChild(i).GetComponent<WeaponUnit>();
            }
        }

        attackController.AttackAction = null;
        attackController.ReloadAction = null;
        attackController.AttackAction += currentWeapon.weaponClient.Execute;
        attackController.ReloadAction += currentWeapon.weaponClient.Reload;
        attackController.weapon = currentWeapon.GetComponent<Weapon>();
        switch (currentWeapon.weaponUnit)
        {
            case WeaponUnit.WeaponType.Pistol:
                Debug.Log("Currently shooting with Pistol");
                break;
            case WeaponUnit.WeaponType.LaserGun:
                //action event is equal to laser gun mechanic function
                attackController.myWeapon= currentWeapon.GetComponent<IFireable>();
                attackController.fireableWeapon = currentWeapon.GetComponent<IFireable>();
                Debug.Log("Currently shooting with laser gun");

                break;
            case WeaponUnit.WeaponType.Rocket:

                attackController.myWeapon= currentWeapon.GetComponent<IFireable>();
                attackController.fireableWeapon = currentWeapon.GetComponent<IFireable>();
                Debug.Log("Currently shooting with a Rocket");
                break;
            case WeaponUnit.WeaponType.Riffle:
                Debug.Log("Currently shooting with Rifle");
                break;
            case WeaponUnit.WeaponType.Sward:
                Debug.Log("Currently using Sward");
                break;
            case WeaponUnit.WeaponType.Explosive:

                attackController.myWeapon= currentWeapon.GetComponent<IWeapon>();
                attackController.explodableWeapon = currentWeapon.GetComponent<IExplodeable>();
                Debug.Log("Currently having a bomb");
                break;
            case WeaponUnit.WeaponType.Throwable:

                attackController.myWeapon= currentWeapon.GetComponent<IWeapon>();
                attackController.throwableWeapon = currentWeapon.bulletPrefab.GetComponent<IThrowable>();
                Debug.Log("Currently having a throwable weapon");
                break;
            default:
                attackController.AttackAction = null;
                attackController.ReloadAction = null;
                Debug.Log("Currently shooting with nothing");
                break;
        }
    }

    //Sort weapons
    private void InitializeButtonListener()
    {
        for (int k = 0; k < transform.childCount; k++)
        {
            WeaponUnit unit = transform.GetChild(k).GetComponent<WeaponUnit>();
            if (unit == null)
                return;

            unit.GetComponent<Button>().onClick.AddListener(delegate
            {
                SelectUnit(unit);
                CheckCurrentWeapon();
            });
        }
    }

    //Hover the selected Weapon
    public void HoverWeaponUnit()
    {
        currentWeapon.transform.DOScale(new Vector2(1.2f, 1.2f), .4f);

        foreach (Transform unit in transform)
        {
            if (!unit.gameObject.GetComponent<WeaponUnit>().isSelected)
            {
                unit.DOScale(new Vector2(1f, 1f), .3f);
            }
        }
    }



}
