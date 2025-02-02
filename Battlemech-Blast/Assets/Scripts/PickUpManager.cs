using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class PickUpManager : MonoBehaviour
{
    public static PickUpManager instance;
    public List<GameObject> powerups = new List<GameObject>();
    public Tilemap tile;


    public int startHPAmount;
    public int startAmmoAmount;

    public GameObject spawnEffect;
    public GameObject healBurstEffect;

    void Awake()
    {
        instance = this;
    }

    void Start()
    {
        SpawnHealth();
        SpawnAmmo();
    }
    public float startTimeToSpawn;
    float timeToSpawn;
    void Update()
    {

        if (timeToSpawn <= 0)
        {
            SpawnHealth();
            SpawnAmmo();
            timeToSpawn = startTimeToSpawn;
        }
        else
        {
            timeToSpawn -= Time.deltaTime;
        }
    }
    public void SpawnHealth()
    {

        for (int i = 0; i < startHPAmount; i++)
        {
            Vector2Int tileMax = (Vector2Int)tile.cellBounds.max;
            Vector2Int tileMin = (Vector2Int)tile.cellBounds.min;
            Vector3Int bounds = new Vector3Int((int)Mathf.Round(UnityEngine.Random.Range(tileMin.x + 10, tileMax.x - 5)), (int)Mathf.Round(UnityEngine.Random.Range(tileMin.y + 5, tileMax.y - 5)), 6);
            GameObject particle = Instantiate(healBurstEffect, (Vector3)bounds, Quaternion.identity, transform);
            Instantiate(powerups[0], (Vector3)bounds, Quaternion.identity, transform);
            Destroy(particle, 1f);
        }

    }
    public void SpawnAmmo()
    {
        for (int i = 0; i < startAmmoAmount; i++)
        {
            Vector2Int tileMax = (Vector2Int)tile.cellBounds.max;
            Vector2Int tileMin = (Vector2Int)tile.cellBounds.min;

            Vector3Int bounds = new Vector3Int((int)Mathf.Round(UnityEngine.Random.Range(tileMin.x + 10, tileMax.x - 5)), (int)Mathf.Round(UnityEngine.Random.Range(tileMin.y + 5, tileMax.y - 5)), 6);
            GameObject particle = Instantiate(spawnEffect, (Vector3)bounds, Quaternion.identity, transform);
            Instantiate(powerups[1], (Vector3)bounds, Quaternion.identity, transform);
            Destroy(particle, 1f);

        }
    }
}
