using Photon.Pun;
using Photon.Realtime;
using UnityEngine;
using UnityEngine.UI;

public class HealthSystem : MonoBehaviour
{
    public static HealthSystem instance;

    PhotonView photonV;
    public int maxHealth;
    public int currentHealth;
    public int subHealth;

    public Slider sliderHealth;
    public Sprite redHP;
    public Sprite greenHP;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
    }
    void Start()
    {
        photonV = GetComponent<PhotonView>();

        this.currentHealth = this.maxHealth;
        this.sliderHealth.maxValue = this.currentHealth;

    }

    public void CheckKillOwnership()
    {
        if (this.currentHealth <= 0)
        {

        }
    }
    public void LoseHealth(int health, PhotonView pv)
    {

        if (!photonV.IsMine)
            return;

        if (this.currentHealth > 0)
        {
            this.currentHealth -= health;
            UpdateSlider();
        }
        if (this.currentHealth <= 0)
        { 
            if (this.gameObject.tag == "Player")
            {

                if (GUIManager.instance.gameMode == GUIManager.GameMode.PVP)
                {

                    if (photonV.IsMine)
                    {
                        PlayerPhotonManager.Instance.DestroyPlayer();
                    }
                }

            }
            if (this.gameObject.tag == "Enemy" || this.gameObject.tag == "EnemyClose" || this.gameObject.tag == "EnemyRanged")
            {

                PlayerPhotonManager.Instance.DestroyEnemy(this.gameObject.transform);

            }

            if (pv.gameObject.tag == "Enemy" || pv.gameObject.tag == "EnemyClose" || pv.gameObject.tag == "EnemyRanged")
                return;

            //Check bullet ownership and give him credit
            pv.gameObject.GetComponent<PlayerMatchStats>().UpdateKills();
            //PlayerMatchStats.Instance.UpdateKills(pv.Owner);


        }
    }


    public void GetHealth(int health)
    {
        if (this.currentHealth < this.maxHealth)
        {
            this.currentHealth += health;
            if(this.currentHealth > this.maxHealth)
            {
                this.currentHealth = this.maxHealth;
            }
            Debug.Log("You get " + health + " Added");
        }
        else
        {
            Debug.Log("You failed getting health");
        }
    }

    public void UpdateSlider()
    {
        this.sliderHealth.value = this.currentHealth;

        if (this.sliderHealth.value <= 25)
        {
            this.sliderHealth.transform.GetChild(1).GetChild(0).GetComponent<Image>().sprite = this.redHP;
        }
        else
        {
            this.sliderHealth.transform.GetChild(1).GetChild(0).GetComponent<Image>().sprite = this.greenHP;
        }
    }
    private void Update()
    {
        if (!photonV.IsMine)
            return;
        UpdateSlider();
    }
}
