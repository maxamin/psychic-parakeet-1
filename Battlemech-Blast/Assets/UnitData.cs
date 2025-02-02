using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
public class UnitData : MonoBehaviour
{

    public Text _playerName;
    public Text _number;
    public Text _mode;
    public Text _kills;
    public Text _deaths;
    public string playerName;
    public string mode;
    public int no;
    public int kills;
    public int deaths;

    void Start()
    {

    }

    void Update()
    {
        _number.text = no.ToString();
        _kills.text = kills.ToString();
        _deaths.text = deaths.ToString();
        _playerName.text = playerName;
        _mode.text = mode;

    }

    public void UpdateStats(int no, int kills, int deaths, string playerName, string mode)
    {

        this.no = no;
        this.kills = kills;
        this.deaths = deaths;
        this.playerName = playerName;
        this.mode = mode;
    }

}
