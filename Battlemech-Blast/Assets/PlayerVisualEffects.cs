using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerVisualEffects : MonoBehaviour
{

    public static PlayerVisualEffects instance;

    [Header("Death Effects")]
    public GameObject bloodyDeath;
    public GameObject poisonDeath;
    public GameObject roundCloudExplosionDeath;

    [Space]
    [Header("Spawn Effects")]
    public GameObject landingEffect;
    public GameObject shrinkingEffect;



    [Space]
    [Header("Scene Object Effects")]
    public GameObject healOnceEffect;
    public GameObject healBurstEffect;
    public GameObject healingEffect;



    private void Awake()
    {
        if (instance == null)
            instance = this;

    }


    public void PlayerDeathEffect()
    {

    }

    public void EnemyDeathEffect()
    {

    }

    public void VibrantScreenEffect()
    {



    }


}
