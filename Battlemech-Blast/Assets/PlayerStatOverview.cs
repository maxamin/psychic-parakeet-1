using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
using Photon.Realtime;
using Hashtable = ExitGames.Client.Photon.Hashtable;

public class PlayerStatOverview : MonoBehaviour
{
    public static PlayerStatOverview Instance;

    private const string KEY_DEATHS = "Deaths";
    private const string KEY_KILLS = "Kills";

    private PhotonView photonV;

    [Header("Player Stats")]
    private UnitData unit;
    private Dictionary<int, GameObject> playerListEntries;

    public Transform statsMenu;
    public GameObject dataItem;
    public GameObject dataContainer;
    public int deaths;
    public int kills;


    public Text killsText;
    public Text aliveText;
    public Text botsText;

    public int alive;
    public int bots;
    public int maxBots;



    private void Awake()
    {
        if (Instance == null)
            Instance = this;
    }

    void Start()
    {
        photonV = GetComponent<PhotonView>();
    }
    void Update()
    {
        ShowMatchStats();
        UpdateStats();
    }


    public void UpdatePlayerMatchStats()
    {

        if (playerListEntries == null)
        {
            playerListEntries = new Dictionary<int, GameObject>();
        }




        foreach (Player p in PhotonNetwork.PlayerList)
        {
            if (playerListEntries.ContainsKey(p.ActorNumber))
                return;


            GameObject entry = Instantiate(dataItem);
            entry.transform.SetParent(dataContainer.transform);
            entry.transform.localScale = Vector3.one;


            unit = entry.GetComponent<UnitData>();

            object m_deaths;
            object m_kills;
            this.deaths = (p.CustomProperties.TryGetValue(KEY_DEATHS, out m_deaths)) ? (int)m_deaths : 0;
            this.kills = (p.CustomProperties.TryGetValue(KEY_KILLS, out m_kills)) ? (int)m_kills : 0;

            unit.UpdateStats(p.ActorNumber, this.kills, this.deaths, p.NickName, GUIManager.GameMode.PVP.ToString());




            if (!playerListEntries.ContainsKey(p.ActorNumber))
                playerListEntries.Add(p.ActorNumber, entry);




            Debug.Log(p.NickName + ",   " + p.ActorNumber + ",   " + deaths + ",   " + kills);

        }

    }

    private void UpdateStats()
    {
        alive = PhotonNetwork.CurrentRoom.PlayerCount;
        bots = EnemyNetworkManager.Instance.activeEnemyList.Count;
        maxBots = EnemyNetworkManager.Instance.maxBotsSpawned;


        aliveText.text = alive.ToString();
        killsText.text = kills.ToString();
        botsText.text = bots.ToString()+"/"+maxBots;
    }


    public void UpdateKills(Player owner)
    {
        if (owner == photonV.Owner)
        {
            Hashtable killHash = new Hashtable();
            kills += 1;
            killHash.Add(KEY_KILLS, kills);
            owner.SetCustomProperties(killHash);
        }
    }


    public void UpdateDeath(Player owner)
    {
        if (owner == photonV.Owner)
        {
            Hashtable deathHash = new Hashtable();
            deaths += 1;
            deathHash.Add(KEY_DEATHS, deaths);
            owner.SetCustomProperties(deathHash);
        }
    }

    private void UpdatePlayerStats()
    {

        Player p = PhotonNetwork.LocalPlayer;
        object m_deaths;
        object m_kills;
        this.deaths = (p.CustomProperties.TryGetValue(KEY_DEATHS, out m_deaths)) ? (int)m_deaths : 0;
        this.kills = (p.CustomProperties.TryGetValue(KEY_KILLS, out m_kills)) ? (int)m_kills : 0;

        unit.UpdateStats(p.ActorNumber, this.kills, this.deaths, p.NickName, GUIManager.GameMode.PVP.ToString());

    }


    public void ShowMatchStats()
    {
        //if (Input.GetKey(KeyCode.Tab))
        //{
        //    UpdatePlayerStats();
        //}
        //if (Input.GetKey(KeyCode.Tab))
        //{
        //    statsMenu.gameObject.SetActive(true);
        //}
        //if (Input.GetKeyUp(KeyCode.Tab))
        //{
        //    statsMenu.gameObject.SetActive(false);
        //}
    }

}
