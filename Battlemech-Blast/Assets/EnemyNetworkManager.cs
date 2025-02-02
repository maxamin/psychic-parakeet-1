using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
using DG.Tweening;

public class EnemyNetworkManager : MonoBehaviour
{
    public static EnemyNetworkManager Instance;

    PhotonView pv;

    public GameObject defaultEnemyType;
    public GameObject slowEnemyType;
    public GameObject swordEnemyType;

    public List<GameObject> enemyCounterList = new List<GameObject>();
    public List<GameObject> parkingEnemyList = new List<GameObject>();


    public List<GameObject> activeEnemyList = new List<GameObject>();


    public Text waveText;


    private int maxBots;
    public int maxBotsSpawned = 0;

    public List<Map> maps;
    private Map activeMap;



    private void Awake()
    {
        if (Instance == null)
            Instance = this;
    }


    void Start()
    {
        pv = GetComponent<PhotonView>();



        var maxBots = PhotonNetwork.CurrentRoom.CustomProperties["MaxBots"];
        Debug.Log(maxBots.ToString());

        for (int i = 0; i < maps.Count; i++)
        {
            maps[i].InitializeMap(1);
        }


        SyncEnemyWithMap();
        ActiveEnemyList(activeMap);
        CheckWaveGenerated(maps[0]);
        CheckWaveGenerated(maps[1]);



    }

    public void CheckWaveGenerated(Map map)
    {
        if (map.waveGenerated)
            return;


        AnimateWaveUI(map);
        if (PhotonNetwork.IsMasterClient)
        {
            if (ActiveEnemyList(map).Count <= 0)
            {
                SpawnEnemies(map);
            }
        }
    }

    void SyncEnemyWithMap()
    {
        if (PlayerPhotonManager.Instance.activeMap == maps[0].mapName)
        {
            activeMap = maps[0];
        }
        else if (PlayerPhotonManager.Instance.activeMap == maps[1].mapName)
        {
            activeMap = maps[1];
        }
    }

    void Update()
    {
        SyncEnemyWithMap();
        ActiveEnemyList(activeMap);
        CheckWaveGenerated(activeMap);

    }

    public void AnimateWaveUI(Map map)
    {
        waveText.text = "Wave " + map.currentWave;
        waveText.color = new Color(255, 255, 255, 0);

        DOTween.Sequence()
            .AppendCallback(delegate () { waveText.gameObject.SetActive(true); })
            .AppendInterval(1.5f)
            .Append(waveText.DOFade(1, 2f))
            .AppendInterval(2.5f)
            .Append(waveText.DOFade(0, 2f))
            .AppendCallback(delegate () { waveText.gameObject.SetActive(false); });

    }

    public void StartWave()
    {
        if (ActiveEnemyList(activeMap).Count <= 0)
            activeMap.waveGenerated = false;
    }

    private void ClearList(List<GameObject> list)
    {
        if (list.Count > 0)
            for (int i = 0; i < list.Count; i++)
            {
                Destroy(list[i]);
            }
        list.Clear();
    }

    public void ReleaseFromArray(GameObject g)
    {
        switch (activeMap.mapName)
        {
            case "dungeon":
                enemyCounterList.Remove(g);
                ActiveEnemyList(activeMap);
                break;
            case "parking":
                parkingEnemyList.Remove(g);
                ActiveEnemyList(activeMap);
                break;
            default:
                break;
        }
    }
    public void SpawnEnemies(Map map)
    {

        if (map.maxWaves < 7)
        {
            for (int i = 0; i < map.currentWave * 3; i++)
            {
                CreatureSpawner(map);
            }
            maxBotsSpawned = ActiveEnemyList(map).Count;
        }

        map.currentWave++;
        map.waveGenerated = true;

    }

    private void CreatureSpawner(Map map)
    {
        GameObject e = PhotonNetwork.Instantiate("Enemies/" + defaultEnemyType.name
            , map.enemyPositions[Random.Range(0, map.enemyPositions.Count)]
            , Quaternion.identity, 0);

        ActiveEnemyList(map).Add(e);
    }
    public List<GameObject> ActiveEnemyList(Map map)
    {

        if (map.mapName == maps[0].mapName)
        {
            activeEnemyList = enemyCounterList;
            return activeEnemyList;
        }
        else if (map.mapName == maps[1].mapName)
        {
            activeEnemyList = parkingEnemyList;
            return activeEnemyList;

        }
        else
        {
            Debug.Log("null return");
            return null;
        }
    }

}
