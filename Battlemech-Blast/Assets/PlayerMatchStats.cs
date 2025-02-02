using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
using Photon.Realtime;
using Hashtable = ExitGames.Client.Photon.Hashtable;

public class PlayerMatchStats : MonoBehaviour
{
    public static PlayerMatchStats Instance;

    private const string KEY_DEATHS = "Deaths";
    private const string KEY_KILLS = "Kills";


    private PhotonView photonV;

    [Header("Player Stats")]
    private UnitData unit;
    private Dictionary<int, GameObject> playerListEntries;




    private void Awake()
    {
        if (Instance == null)
            Instance = this;
    }

    void Start()
    {
        photonV = GetComponent<PhotonView>();
    }


    

    public void UpdateKills()
    {
        PlayerStatOverview.Instance.UpdateKills(photonV.Owner);
    }
    


}
