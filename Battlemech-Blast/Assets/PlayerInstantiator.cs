using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;
using static Photon.Pun.PlayerPhotonManager;
public class PlayerInstantiator : MonoBehaviour
{
    public enum Controller { Keyboard, Joystick };
    public static PlayerInstantiator Instance;

    private bool sceneLoaded;
    private float delay;
    private PhotonView photonV;

    public Controller controllerState;

    public GameObject teammatePrefab;
    public GameObject playerPrefab;
    public List<Vector2> cryptOpsPositions = new List<Vector2>();
    public List<Vector2> aliensPositions = new List<Vector2>();
    public List<Vector2> enemyPositions = new List<Vector2>();
    public List<GameObject> enemyPrefabs = new List<GameObject>();


    public float timeToSpawnEnemy;
    public string mechName;
    public string pilotName;
    public string playerTeam;



    void Awake()
    {
        Instance = this;
        DontDestroyOnLoad(this.gameObject);
    }

    private void Start()
    {
        photonV = GetComponent<PhotonView>();


        if (photonV.IsMine)
            this.gameObject.SetActive(true);
        else
            this.gameObject.SetActive(false);
    }

    void Update()
    {

    }
    public void InstantiatePlayerPVP(string playersName, string playerTeam)
    {
        this.mechName = playersName;
        this.playerTeam = playerTeam;
    }
    public void SetUp()
    {

    }
    public IEnumerator InstantiatePlayerPVE(GameObject playerPrefab, float delay, string playerTeam)
    {

        this.playerPrefab = playerPrefab;
        this.playerTeam = playerTeam;

        yield return new WaitForSeconds(delay);
        sceneLoaded = true;
        UnityEngine.SceneManagement.SceneManager.LoadScene("PVEGameScene");
    }
    public Vector2 RandomCryptOpsPosition()
    {
        Vector2 randomPosition = cryptOpsPositions[Random.Range(0, cryptOpsPositions.Count)];
        return randomPosition;
    }
    public Vector2 RandomAlienPosition()
    {
        Vector2 randomPosition = enemyPositions[Random.Range(0, enemyPrefabs.Count)];
        return randomPosition;
    }
    void InstantiateEnemies()
    {
        int k = 0;
        for (int i = 0; i < enemyPositions.Count; i++)
        {
            if (k <= 2)
            {
                GameObject dummy = Instantiate(enemyPrefabs[k], enemyPositions[Random.Range(0, enemyPositions.Count)], Quaternion.identity, GameHandler.instance.enemyContainer);
                k++;
            }
            else
            {
                k = 0;
            }
        }
    }
    

}
