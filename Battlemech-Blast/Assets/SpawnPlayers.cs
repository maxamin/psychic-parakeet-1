using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;

public class SpawnPlayers : MonoBehaviour
{
    public static SpawnPlayers instance;
    public GameObject playerPrefab;
    public Vector2[] cryptopsPositions;
    public Vector2[] aliensPositions;
    public static List<Transform> playerList = new List<Transform>();
    void Awake()
    {
        instance = this;
    }
    void Start()
    {
        if (playerPrefab == null)
        {
            Debug.LogError("<Color=Red><a>Missing</a></Color> playerPrefab Reference. Please set it up in GameObject 'Game Manager'", this);
        }
        else
        {
            InstantiatePlayer();
        }
    }

    public void InstantiatePlayer()
    {

    }
    
    //public void ReSpawnPlayer()
    //{
    //    if (GameHandler.instance.playerTransform != null)
    //        Destroy(GameHandler.instance.playerTransform.gameObject);
    //    if (GameHandler.instance.teammateTransform != null)
    //        Destroy(GameHandler.instance.teammateTransform.gameObject);
    //    if (GameHandler.instance.cam!= null)
    //        Destroy(GameHandler.instance.cam.gameObject);
    //    string playerName = PlayerInstantiator.instance.playerName;
    //    string team = PlayerInstantiator.instance.playerTeam;
    //    Debug.Log(playerName + " From " + "<Color=Red><a>" + team + "</a></Color>");
    //    GameObject player = (team == "Blast") ? PhotonNetwork.Instantiate(playerName, cryptopsPositions[Random.Range(0, cryptopsPositions.Length)], Quaternion.identity)
    //        : PhotonNetwork.Instantiate(playerName, aliensPositions[Random.Range(0, aliensPositions.Length)], Quaternion.identity);

    //    if (player.GetComponent<PhotonView>().IsMine)
    //    {
    //        GameObject teammate = Instantiate(PlayerInstantiator.instance.teammatePrefab, new Vector2(player.transform.position.x + .7f, player.transform.position.y), Quaternion.identity);
    //        GameHandler.instance.teammateTransform = teammate.transform;
    //        GameHandler.instance.playerTransform = player.transform;
    //        GameHandler.instance.CameraFollowTarget(player.transform);
    //        GameHandler.instance.playerTransform.GetComponent<HealthSystem>().InsertSlider();
    //        GameHandler.instance.AddPlayerToList();
    //        playerList.Add(player.transform);

    //    }
    //}

}
