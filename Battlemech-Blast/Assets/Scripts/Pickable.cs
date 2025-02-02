using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pickable : MonoBehaviour
{
    public enum ItemType
    {
        None,
        Weapon,
        SpecialPower,
        Currency,
        PowerUp
    }

    public ItemType type;

    [Header("Pickable Components")]
    public GameObject pickablePrefab;



    void Update()
    {
        CheckCollider();
    }


    private float checkRaduis = .5f;

    void CheckCollider()
    {

        Collider2D collision = Physics2D.OverlapCircle(transform.position, checkRaduis);

        if (collision.name == "Tilemap_Bounds")
        {
            Destroy(gameObject);

        }
    }
}
