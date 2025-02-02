using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;
using TMPro;
using Photon.Pun.UtilityScripts;
using Photon.Realtime;
using Hashtable = ExitGames.Client.Photon.Hashtable;
using Cinemachine;

namespace Photon.Pun
{
    public class PlayerPhotonManager : MonoBehaviourPunCallbacks
    {

        

        public static PlayerPhotonManager Instance;

        private PhotonView pv;
        private GameObject player;
        private PlayerStatOverview playerStat;
        private PlayerVisualEffects vfxManager;


        public Vector2[] secondMapPositions;
        public Vector2[] blastPositions;
        private Vector2[] activePositions;
        public string[] maps;
        public string activeMap { get; private set; }



        public GameObject cam;
        public GameObject miniCam;
        public GameObject enemiesContainer;



        public List<GameObject> deathEffects = new List<GameObject>();
        public List<GameObject> tagEffects = new List<GameObject>();


        [Header("Countdown time in seconds")]
        public float Countdown = 5.0f;
        private bool isTimerRunning;
        private int startTime;
        [Header("Reference to a Text component for visualizing the countdown")]
        public TextMeshProUGUI Text;



        private void Awake()
        {
            if (Instance == null)
                Instance = this;
        }
        void Start()
        {
            pv = GetComponent<PhotonView>();
            if (pv.IsMine)
            {
                this.gameObject.SetActive(true);
                //GameObject enemy = PhotonNetwork.Instantiate(enemies.name, Vector2.one, Quaternion.identity);
                playerStat = GetComponent<PlayerStatOverview>();
                vfxManager = GetComponent<PlayerVisualEffects>();

                deathEffects.Add(vfxManager.roundCloudExplosionDeath);
                deathEffects.Add(vfxManager.bloodyDeath);

            }
            else
            {
                this.gameObject.SetActive(false);

                return;
            }
            CheckActiveMapPositions();

            RejoinPlayer(PlayerSpawnPosition(activePositions));
            playerStat.UpdatePlayerMatchStats();

        }



        void Update()
        {
            CheckActiveMapPositions();



            if (!this.isTimerRunning) return;

            float countdown = TimeRemaining();
            this.Text.text = Mathf.FloorToInt(countdown).ToString();

            if (countdown > 0.0f) return;

            OnTimerEnds();
        }


        private float TimeRemaining()
        {

            this.Countdown -= Time.deltaTime;

            return this.Countdown;
        }
        private void Initialize()
        {

            this.startTime = 0;
            Debug.Log("Initialize sets StartTime " + this.startTime + " server time now: " + PhotonNetwork.ServerTimestamp + " remain: " + TimeRemaining());


            this.isTimerRunning = TimeRemaining() > 0;

            if (this.isTimerRunning)
                OnTimerRuns();
            else
                OnTimerEnds();

        }

        private void OnTimerEnds()
        {
            this.isTimerRunning = false;

            Debug.Log("Emptying info text.", this.Text);
            this.Text.text = string.Empty;
            this.Countdown = 5;

            RejoinPlayer(PlayerSpawnPosition(activePositions));

        }
        private void OnTimerRuns()
        {
            this.isTimerRunning = true;
            this.enabled = true;
        }



        public void AssignCameraFollowTarget(GameObject target)

        {
            if (target.GetComponent<PhotonView>().IsMine)
            {
                if (cam.activeInHierarchy)
                {
                    cam.transform.GetChild(0).GetComponent<CinemachineVirtualCamera>().Follow = target.transform;
                    miniCam.GetComponent<MinimapManager>().playerReference = target.transform;
                    return;
                }
                GameObject camera = Instantiate(cam, transform.parent);
                GameObject miniCamera = Instantiate(miniCam, transform.parent);
                miniCamera.GetComponent<MinimapManager>().playerReference = target.transform;
                camera.transform.GetChild(0).GetComponent<CinemachineVirtualCamera>().Follow = target.transform;
                cam = camera;
                miniCam = miniCamera;
                //camera.SetUp(() => target.position);
            }
        }
        public void AssignCharacterSprites()
        {

        }
        public void SwitchMap(string sceneName)
        {
            //pv.RPC("RPC_DestroyPlayer", RpcTarget.AllBuffered, player.transform.position);
            player.SetActive(false);
            PhotonNetwork.Destroy(player.GetComponent<PhotonView>());
            player = null;

            if (sceneName == maps[0])
            {
                activeMap = sceneName;
                CheckActiveMapPositions();
            }
            else if (sceneName == maps[1])
            {
                activeMap = sceneName;
                CheckActiveMapPositions();
            }

            RejoinPlayer(PlayerSpawnPosition(activePositions));

        }
        private void CheckActiveMapPositions()
        {
            if (activeMap == maps[0])
            {
                activePositions = blastPositions;
            }
            else if (activeMap == maps[1])
            {
                activePositions = secondMapPositions;
            }
            else
            {
                activeMap = maps[0];
                activePositions = blastPositions;

            }
        }

        public void RejoinPlayer(Vector2 spawnPosition)
        {
            if (player == null)
            {
                // avoid this call on rejoin (ship was network instantiated before)

                Vector3 playerPosition = spawnPosition;
                pv.RPC("RPC_LandingEffect", RpcTarget.AllBuffered, playerPosition);

                player = PhotonNetwork.Instantiate("Players/" + "Entity", playerPosition, Quaternion.identity, 0);
                player.GetComponent<UnitManager>().InitializePlayer(PlayerInstantiator.Instance.mechName, PlayerInstantiator.Instance.pilotName);

                PlayerInfoDebuger();
                AssignCameraFollowTarget(player);
                //Assign player stats 


            }
        }

        //In Order to fix player appear in diffirent skins to other clients
        [PunRPC]
        private void RPC_AddPlayer(Vector3 playerPosition)
        {
            player = PhotonNetwork.Instantiate("Players/" + "Entity", playerPosition, Quaternion.identity, 0);
            player.GetComponent<UnitManager>().InitializePlayer(PlayerInstantiator.Instance.mechName, PlayerInstantiator.Instance.pilotName);
        }

        public Vector2 PlayerSpawnPosition(Vector2[] spawnPoses)
        {
            return spawnPoses[Random.Range(0, spawnPoses.Length)];
        }

        public void PlayerInfoDebuger()
        {
            string playerName = PlayerInstantiator.Instance.mechName;
            string pilotName = PlayerInstantiator.Instance.pilotName;
            string team = PlayerInstantiator.Instance.playerTeam;
            Debug.Log("Pilot " + pilotName + " in the " + playerName + " Mech " + " From " + "<Color=Red><a>" + team + "</a></Color>");

        }


        public void DestroyPlayer()
        {
            pv.RPC("RPC_DestroyPlayer", RpcTarget.AllBuffered, player.transform.position);
            player.SetActive(false);
            playerStat.UpdateDeath(pv.Controller);

            PhotonNetwork.Destroy(player.GetComponent<PhotonView>());
            player = null;
            CameraShake();
            Initialize();
        }

        public void DestroyEnemy(Transform target)
        {
            pv.RPC("RPC_DestroyEnemy", RpcTarget.AllBuffered, target.position);
            PhotonNetwork.Destroy(target.gameObject);
            EnemyNetworkManager.Instance.ReleaseFromArray(target.gameObject);
            EnemyNetworkManager.Instance.StartWave();

        }

        [Header("Camera Shake Params")]
        [Range(0, 10)]
        public int vibrato;
        public float strength;
        public float duration;
        public float randomness;


        public void CameraShake()
        {
            cam.transform.DOShakePosition(duration, strength, vibrato, randomness, false);
            Debug.Log("Shake camera");

        }


        #region RPC_CALLBACKS


        [PunRPC]
        private void RPC_LandingEffect(Vector3 spawnPos)
        {
            GameObject landEff = Instantiate(vfxManager.landingEffect, spawnPos, Quaternion.identity);
            Destroy(landEff, 3f);
        }

        [PunRPC]
        private void RPC_DestroyPlayer(Vector3 spawnPos)
        {
            for (int i = 0; i < deathEffects.Count; i++)
            {
                GameObject dVFX = Instantiate(deathEffects[i], spawnPos, Quaternion.identity);
                Destroy(dVFX, 4f);
            }


        }


        [PunRPC]
        private void RPC_DestroyEnemy(Vector3 spawnPos)
        {

            GameObject deathEffect = Instantiate(deathEffects[0], spawnPos, Quaternion.identity);
            Destroy(deathEffect, 3f);

            GameObject tag = Instantiate(tagEffects[Random.Range(0, tagEffects.Count)], spawnPos, Quaternion.identity);
            Destroy(tag, 3f);
        }

        #endregion

        #region PUN_CALLBACKS


        public override void OnMasterClientSwitched(Player newMasterClient)
        {
            if (PhotonNetwork.LocalPlayer.ActorNumber == newMasterClient.ActorNumber)
            {

            }
        }

        public override void OnPlayerLeftRoom(Player otherPlayer)
        {
            PhotonNetwork.Destroy(player);
        }
        public override void OnPlayerPropertiesUpdate(Player targetPlayer, Hashtable changedProps)
        {
            if (!PhotonNetwork.IsMasterClient)
            {
                return;
            }
        }

        #endregion




    }
}