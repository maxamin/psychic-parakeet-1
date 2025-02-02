using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName ="Map", menuName ="New Map", order =2)]
public class Map:ScriptableObject
{
    public string mapName;
    public int currentWave;
    public int maxWaves;
    public bool waveGenerated;

    public List<Vector2> enemyPositions;

    public void InitializeMap(int currentWave)
    {
        this.waveGenerated = false;
        this.currentWave = currentWave;
    }
}