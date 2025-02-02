// --------------------------------------------------------------------------------------------------------------------
// <summary>
//  Game Manager for the Asteroid Demo
// </summary>
// <author>developer@exitgames.com</author>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;
using Photon.Pun.UtilityScripts;
using Photon.Realtime;
using System.Collections;
using UnityEngine;
using Cinemachine;
using UnityEngine.UI;
using TMPro;
using Photon.Pun;
using Hashtable = ExitGames.Client.Photon.Hashtable;

namespace Photon.Pun
{
    public class BattleGameManager : MonoBehaviourPunCallbacks
    {
        public static BattleGameManager Instance = null;


        private PhotonView photonV;

        public PlayerPhotonManager playerPM;
        public Transform screenContainer;
        public List<Vector2> parkingEnemyPosition = new List<Vector2>();

        [Header("Countdown time in seconds")]
        public float Countdown = 5.0f;
        private bool isTimerRunning;
        private int startTime;


        #region UNITY

        public void Awake()
        {
            Instance = this;
            StartGame();
        }

        public override void OnEnable()
        {
            base.OnEnable();

        }

        public void Start()
        {
            photonV = GetComponent<PhotonView>();
            Hashtable props = new Hashtable
            {
                {AsteroidsGame.PLAYER_LOADED_LEVEL, true}
            };
            PhotonNetwork.LocalPlayer.SetCustomProperties(props);


            if (PhotonNetwork.IsMasterClient)
            {
                photonV.RPC("RPC_InitializeTimer", RpcTarget.AllBuffered, this.Countdown);
            }

            Initialize();



        }

        public override void OnDisable()
        {
            base.OnDisable();


        }
        private void Update()
        {
            if (!this.isTimerRunning) return;

            float countdown = TimeRemaining();

            float minutes = Mathf.FloorToInt(countdown / 60);
            float seconds = Mathf.FloorToInt(countdown % 60);
            timeText.text = minutes.ToString("00") + ":" + seconds.ToString("00");

            if (countdown > 0.0f) return;

            OnTimerEnds();

        }
        public void LeaveGame()
        {
            PhotonNetwork.LeaveRoom();
            //UnityEngine.SceneManagement.SceneManager.LoadScene("MainMenu");
        }

        // called by OnCountdownTimerIsExpired() when the timer ended
        public void StartGame()
        {

            Debug.Log("StartGame!");

            // on rejoin, we have to figure out if the spaceship exists or not
            // if this is a rejoin (the ship is already network instantiated and will be setup via event) we don't need to call PN.Instantiate



            GameObject p = PhotonNetwork.Instantiate(playerPM.name, Vector2.one, Quaternion.identity);

            if (PhotonNetwork.IsMasterClient)
            {

            }
        }


        #endregion

        #region COROUTINES

        private IEnumerator EndOfGame(string winner, int score)
        {
            float timer = 5.0f;

            while (timer > 0.0f)
            {
                //InfoText.text = string.Format("Player {0} won with {1} points.\n\n\nReturning to login screen in {2} seconds.", winner, score, timer.ToString("n2"));

                yield return new WaitForEndOfFrame();

                timer -= Time.deltaTime;
            }

            PhotonNetwork.LeaveRoom();
        }

        #endregion

        #region PUN CALLBACKS

        public override void OnDisconnected(DisconnectCause cause)
        {
            
        }


        public override void OnLeftRoom()
        {
            UnityEngine.SceneManagement.SceneManager.LoadScene("MainMenu");
        }

        #endregion

        #region GAMEOVER

        public GameObject finalResultMenu;
        public GameObject gameOverCanvas;
        public GameObject gameOverIcon;
        public GameObject gameOverButtonContainer;
        public Text timeText;

        private IEnumerator GameOver(float delay)
        {
            yield return new WaitForSeconds(delay);

            gameOverIcon.SetActive(true);
            gameOverCanvas.SetActive(true);
            gameOverButtonContainer.SetActive(true);
        }
        public void ShowStatOverview()
        {
            StartCoroutine(ActivityDelay(8f));
        }
        IEnumerator ActivityDelay(float delay)
        {

            finalResultMenu.SetActive(true);
            gameOverIcon.SetActive(false);
            gameOverButtonContainer.SetActive(false);
            yield return new WaitForSeconds(delay);

            finalResultMenu.SetActive(false);
            gameOverIcon.SetActive(true);
            gameOverButtonContainer.SetActive(true);
        }

        public void Rematch()
        {
            //Rematch
            UnityEngine.SceneManagement.SceneManager.LoadScene("Gamescene");

        }



        #endregion

        private float TimeRemaining()
        {
            this.Countdown -= Time.deltaTime;

            return this.Countdown = (this.Countdown < 0) ? 0 : this.Countdown;

        }
        private void Initialize()
        {
            gameOverCanvas.SetActive(false);

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

            Debug.Log("GameOver");

            foreach (PlayerMovement p in FindObjectsOfType<PlayerMovement>())
            {
                p.gameObject.SetActive(false);
            }

            photonV.RPC("RPC_Gameover", RpcTarget.AllBuffered);
        }
        private void OnTimerRuns()
        {
            this.isTimerRunning = true;
            this.enabled = true;
        }

        public Vector2 RandomPositionInParking()
        {
            return parkingEnemyPosition[Random.Range(0, parkingEnemyPosition.Count - 1)];
        }


        [PunRPC]
        private void RPC_InitializeTimer(float countdown)
        {
            this.Countdown = countdown;
        }

        [PunRPC]
        private void RPC_Gameover()
        {
            StartCoroutine(GameOver(0f));
        }
    }
}