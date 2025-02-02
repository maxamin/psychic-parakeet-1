using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class BombPlanter : Weapon, IWeapon
{
    private PlayerAttackController attackController;




    public float timeToPlant;
    private float timeToElapse;
    private bool m_isPlanted = false;

    private WeaponUnit unit;
    private Bomb bomb;


    [SerializeField] private int m_CurrentAmmo;
    [SerializeField] private int m_Capacity;
    public int CurrentAmmo { get => m_CurrentAmmo; set => m_CurrentAmmo = value; }
    public int Capacity => m_Capacity;


    void Start()
    {
        attackController = transform.parent.GetComponent<WeaponManager>().attackController;
        unit = GetComponent<WeaponUnit>();
        timeToElapse = timeToPlant;
        m_CurrentAmmo = m_Capacity;


    }

    void Update()
    {
        if (!unit.isSelected)
        {
            HideBomb();
        }
        CheckBombPlanting();
    }
    public override void Trigger()
    {


        m_isPlanted = true;
        Debug.Log("Plant Bomb Successfully");
        m_CurrentAmmo -= 1;
        if (m_isPlanted && attackController.bomb == null)
        {
            attackController.PlantBomb();
            m_isPlanted = false;
        }
    }

    public void SyncPlantOnTimeChange()
    {
        if (timeToElapse != timeToPlant)
        {
            attackController.OnTimeElapsing.Invoke(timeToPlant - timeToElapse, timeToPlant);
            Debug.Log("Time elapsing");
        }
        else
        {
            attackController.OnSliderUpdated.Invoke();

        }
    }
    public void Planting()
    {
        if (!m_isPlanted && timeToElapse > 0 && attackController.bomb == null)
        {
            timeToElapse -= Time.deltaTime;
            PreviewBombPlacement();
        }
        else
        {
            if (timeToElapse <= 0)
                Trigger();
            HideBomb();
            timeToElapse = timeToPlant;
        }
    }

    public void PreviewBombPlacement()
    {
        if (m_isPlanted && attackController.bombPreviewGO == null)
            return;

        attackController.bombPreviewGO.GetComponent<SpriteRenderer>().enabled = true;

    }

    public void CheckBombPlanting()
    {
        if (Input.GetMouseButtonUp(0))
        {
            if (!m_isPlanted)
            {
                timeToElapse = timeToPlant;
                attackController.OnTimeElapsing.Invoke(timeToPlant - timeToElapse, timeToPlant);
                attackController.OnSliderUpdated.Invoke();
            }
        }
    }
    public void HideBomb()
    {
        attackController.bombPreviewGO.GetComponent<SpriteRenderer>().enabled = false;
        attackController.OnSliderUpdated.Invoke();
    }
    public void Execute()
    {
        Debug.Log("Checking Shoot method");
        if (m_CurrentAmmo > 0)
        {
            Planting();
            SyncPlantOnTimeChange();
        }

    }

    public void Reload()
    {
        Debug.Log("You can't reload");
    }

    public void IncreaseAmmo(int amount)
    {
        Debug.Log("You can't increase ammo");

    }
}
