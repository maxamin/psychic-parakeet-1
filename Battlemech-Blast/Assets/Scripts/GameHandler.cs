using Cinemachine;
using Photon.Pun;
using Photon.Realtime;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameHandler : MonoBehaviour
{
    public static GameHandler instance;
    UnitData unit;

    [Header("Objects")]
    public GameObject cameraFollow;
    public Transform playerTransform;
    public Transform teammateTransform;
    public Transform mapTarget;
    public Transform enemyContainer;
    public Slider healthSlider;
    public Text currentAmmo;
    public TextMeshProUGUI textRespawnCounter;
    private List<GameObject> enemyList = new List<GameObject>();
    public Transform weaponContainer;


    [Header("GameOver UI")]
    public Image gameOverImage;
    public Image loseImage;
    public Image youWinImage;

    private bool isOver = false;
    private bool isWinner = false;
    public int gameOverRace;
    public static bool gameStarted;
    public static bool scoreDecided;
    public bool playerDead;
    public bool respawning;
    public float respawnCounter = 4;

    [Header("Game Scoreboard")]
    public Text _alienScore;
    public Text _cryptOpsScore;
    public int scoreAlien;
    public int scoreCryptOps;


    [Header("Player Stats")]
    public Transform statsMenu;
    public GameObject dataItem;
    public GameObject dataContainer;
    public int deaths;
    public int kills;
    public static bool gameFinished;
    private Dictionary<int, GameObject> playerListEntries;


    void OnEnable()
    {
        textRespawnCounter.gameObject.SetActive(false);
        gameOverImage.gameObject.SetActive(false);
        loseImage.gameObject.SetActive(false);
        youWinImage.gameObject.SetActive(false);

    }
    void Awake()
    {
        if (GameHandler.instance == null)
            GameHandler.instance = this;
    }
    void Start()
    {
        for (int i = 0; i < enemyContainer.childCount; i++)
        {
            enemyList.Add(enemyContainer.GetChild(i).gameObject);
        }


        respawnCounter = 4;

        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVE)
        {

            _alienScore.text = scoreAlien.ToString();
            _cryptOpsScore.text = scoreCryptOps.ToString();

            isOver = false;
            gameFinished = false;
            kills = 0;
            deaths = 0;
            scoreAlien = 0;
            scoreCryptOps = 0;

            GameObject item = Instantiate(dataItem, dataContainer.transform);
            unit = item.GetComponent<UnitData>();


            unit.deaths = this.deaths;
            unit.kills = this.kills;
            unit.mode = GUIManager.GameMode.PVE.ToString();
            //unit._playerName.text = playerTransform.name;
        }

        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVP)
        {

            isOver = false;
            gameFinished = false;



            if (playerTransform.GetComponent<PhotonView>().IsMine)
            {
                kills = 0;
                deaths = 0;
                AddPlayerToList();

            }
            else
            {
                AddPlayerToList();
            }
            if (SpawnPlayers.playerList.Count == 1 || PhotonNetwork.PlayerList.Length == 1)
            {
                gameStarted = false;
            }
        }
    }
    public void AddPlayerToList()
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

            unit._playerName.text = p.NickName;
            unit.no = p.ActorNumber;
            unit.deaths = this.deaths;
            unit.kills = this.kills;
            unit.mode = GUIManager.GameMode.PVP.ToString();
            if (!playerListEntries.ContainsKey(p.ActorNumber))
                playerListEntries.Add(p.ActorNumber, entry);
        }
    }

    void Update()
    {


        _alienScore.text = scoreAlien.ToString();
        _cryptOpsScore.text = scoreCryptOps.ToString();

        GameOver();

        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVP)
        {
            if (PhotonNetwork.PlayerList.Length >= 2 || SpawnPlayers.playerList.Count >= 2)
            {
                gameStarted = true;
                Debug.Log("the game is started");
                respawning = false;

            }
            //if (PhotonNetwork.PlayerList.Length == 1 && gameStarted || SpawnPlayers.playerList.Count == 1 && gameStarted)
            //{
            //    respawning = true;
            //    gameFinished = true;
            //    //StartCoroutine(RestartGame(1.7f));
            //    Debug.Log("You Winnn !!! ");
            //}

            if (PhotonNetwork.CurrentRoom.MaxPlayers < SpawnPlayers.playerList.Count)
            {
                Scene scene = SceneManager.GetActiveScene();
                SceneManager.LoadScene(scene.buildIndex);
            }

            if (playerTransform.GetComponent<PhotonView>().IsMine)
            {
                if (PlayerInstantiator.Instance.playerTeam == "Blast")
                {
                    if (playerDead && !isOver)
                    {
                        if (!scoreDecided)
                        {
                            scoreAlien += 1;
                            scoreDecided = true;
                        }
                        gameFinished = true;
                        respawning = true;

                        StartCoroutine(RestartGame(1.7f));
                    }
                }
                //else if (PlayerInstantiator.instance.playerTeam == "Aliens")
                //{
                //    if (playerDead && !isOver)
                //    {
                //        if (!scoreDecided)
                //        {
                //            scoreCryptOps += 1;
                //            scoreDecided = true;
                //        }
                //        gameFinished = true;
                //        respawning = true;

                //        StartCoroutine(RestartGame(1.7f));
                //    }
                //}

                ShowMatchStats(unit.no, unit._playerName.text, GUIManager.GameMode.PVP.ToString());
            }
        }
        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVE)
        {
            ShowMatchStats(1, this.playerTransform.name, GUIManager.GameMode.PVE.ToString());
            if (playerDead && !isOver)
            {
                if (!scoreDecided)
                {
                    scoreAlien += 1;
                    scoreDecided = true;
                }
                gameFinished = true;

                respawning = true;

                StartCoroutine(RestartGame(1.7f));
            }
            if (enemyContainer.childCount == 0 && !gameFinished)
            {
                scoreDecided = false;

                if (!scoreDecided)
                {
                    if (scoreCryptOps < 9)
                    {
                        scoreCryptOps += 1;
                        scoreDecided = true;
                    }
                }

                kills += 1;
                gameFinished = true;
            }
            if (enemyContainer.childCount == 0 && !isOver && gameFinished)
            {
                respawning = true;
                Debug.Log("player destroyed");
                StartCoroutine(RestartGame(1.7f));
            }
        }
    }

    public void GameOver()
    {
        if (scoreAlien == gameOverRace && !isWinner)
        {
            isOver = true;
            respawning = false;
            isWinner = true;
            Debug.Log("Aliens win");
            StartCoroutine(ShowGameOver(3f, loseImage));
        }
        else if (scoreCryptOps == gameOverRace && !isWinner)
        {
            isOver = true;
            respawning = false;
            isWinner = true;
            Debug.Log("Cryptops win");
            StartCoroutine(ShowGameOver(3f, youWinImage));
        }
    }

    IEnumerator ShowGameOver(float delay, Image winner)
    {
        gameOverImage.gameObject.SetActive(true);
        yield return new WaitForSecondsRealtime(delay);
        gameOverImage.gameObject.SetActive(false);
        winner.gameObject.SetActive(true);
        yield return new WaitForSecondsRealtime(delay);
        SceneManager.LoadScene("MainMenu");
    }

    public IEnumerator RestartGame(float delay)
    {

        yield return new WaitForSeconds(delay);
        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVE)
        {
            if (respawning && !isOver)
            {
                textRespawnCounter.gameObject.SetActive(true);
                respawnCounter -= Time.deltaTime;
                int respawnRate;
                respawnRate = (int)respawnCounter;
                textRespawnCounter.text = respawnRate.ToString();
            }
            else
            {
                textRespawnCounter.gameObject.SetActive(false);
            }

            if (respawnCounter <= 0)
            {
                StartCoroutine(HideTextCounter(.2f));
                RespawnObjects();

            }
        }
        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVP)
        {
            if (playerTransform.GetComponent<PhotonView>().IsMine)
            {
                if (respawning && !isOver)
                {
                    textRespawnCounter.gameObject.SetActive(true);
                    respawnCounter -= Time.deltaTime;
                    int respawnRate;
                    respawnRate = (int)respawnCounter;
                    textRespawnCounter.text = respawnRate.ToString();
                }
                else
                {
                    textRespawnCounter.gameObject.SetActive(false);
                }

                if (respawnCounter <= 0)
                {
                    RespawnObjects();
                    StartCoroutine(HideTextCounter(.2f));
                }
            }
        }
    }
    IEnumerator HideTextCounter(float delay)
    {
        yield return new WaitForSeconds(delay);
        textRespawnCounter.gameObject.SetActive(false);
    }
    public void RespawnObjects()
    {

        enemyList.Clear();
        for (int i = 0; i < Random.Range(7, 10); i++)
        {
            int spawnIndex = Random.Range(0, PlayerInstantiator.Instance.enemyPrefabs.Count);
            GameObject dummy = Instantiate(
                PlayerInstantiator.Instance.enemyPrefabs[spawnIndex],
                PlayerInstantiator.Instance.RandomAlienPosition(),
                Quaternion.identity,
                enemyContainer
                );
            enemyList.Add(dummy);
            EnemyDetection enemyHandler = dummy.GetComponent<EnemyDetection>();

        }
        if (GUIManager.instance.gameMode == GUIManager.GameMode.PVE)
        {
            if (playerTransform != null)
                //playerTransform.GetComponent<HealthSystem>().DestroyPlayer();
            if (teammateTransform != null)
                Destroy(teammateTransform.gameObject);

            GameObject player = Instantiate(PlayerInstantiator.Instance.playerPrefab, PlayerInstantiator.Instance.RandomCryptOpsPosition(), Quaternion.identity);
            GameObject teammate = Instantiate(PlayerInstantiator.Instance.teammatePrefab, new Vector2(player.transform.position.x + .7f, player.transform.position.y), Quaternion.identity);
            teammateTransform = teammate.transform;
            playerTransform = player.transform;

            playerDead = false;
            respawnCounter = 4;
            respawning = false;
            gameFinished = false;
            isOver = false;
        }
        else if (GUIManager.instance.gameMode == GUIManager.GameMode.PVP)
        {
            Debug.Log("respawn is true");
            playerDead = false;
            respawning = false;
            gameFinished = false;
            isOver = false;
            respawnCounter = 4;
            textRespawnCounter.gameObject.SetActive(false);
            //BattleGameManager.Instance.OnCountdownTimerIsExpired();
        }
    }
    public GameObject cam;
    public void ShowMatchStats(int number, string playerName, string mode)
    {
        if (Input.GetKeyDown(KeyCode.Tab))
        {
            unit.UpdateStats(number, this.kills, this.deaths, playerName, mode);
        }
        if (Input.GetKey(KeyCode.Tab))
        {
            statsMenu.gameObject.SetActive(true);
        }
        if (Input.GetKeyUp(KeyCode.Tab))
        {
            statsMenu.gameObject.SetActive(false);
        }
    }
    public void EnemyStopShooting()
    {
        for (int i = 0; i < enemyContainer.childCount; i++)
        {

            if (enemyContainer.GetChild(i).GetComponent<EnemyDetection>() != null)
            {
                enemyContainer.GetChild(i).GetComponent<EnemyDetection>().shooting = false;
                enemyContainer.GetChild(i).GetComponent<EnemyDetection>().ResetShootingDelay();
            }
            else if (enemyContainer.GetChild(i).GetComponent<SlappingEnemy>() != null)
            {
                enemyContainer.GetChild(i).GetComponent<SlappingEnemy>().shooting = false;
                enemyContainer.GetChild(i).GetComponent<SlappingEnemy>().ResetShootingDelay();
            }

        }
    }

    public void CameraFollowTarget(Transform target)
    {
        if (target.GetComponent<PhotonView>().IsMine)
        {
            GameObject camera = Instantiate(cameraFollow, transform.parent);
            camera.transform.GetChild(0).GetComponent<CinemachineVirtualCamera>().Follow = target;
            cam = camera;
            //camera.SetUp(() => target.position);
        }
    }

    public void LeaveGameplay()
    {
        SceneManager.LoadScene("Loading");
    }

}
