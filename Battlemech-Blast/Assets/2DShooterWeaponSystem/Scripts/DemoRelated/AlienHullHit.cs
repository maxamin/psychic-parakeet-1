using UnityEngine;
using System.Collections;

/// <summary>
/// Simple demo scene script for flashing a sprite renderer red when hit.
/// </summary>
[RequireComponent(typeof(SpriteRenderer))]
public class AlienHullHit : MonoBehaviour
{
    private bool isHit;
    private SpriteRenderer spriteRendererCmpt;

	// Use this for initialization
	void Start () 
    {
        // Cache sprite renderer component.
        spriteRendererCmpt = gameObject.GetComponent<SpriteRenderer>();
	}

    IEnumerator OnTriggerEnter2D(Collider2D other)
    {
        // Flash the sprite alternating colours if the collider triggered a hit...
        if (!isHit)
        {
            if (spriteRendererCmpt != null)
            {
                isHit = true;
                var redColour = Color.red;
                for (var n = 0; n < 3; n++)
                {
                    GetComponent<Renderer>().material.color = Color.white;
                    yield return new WaitForSeconds(0.1f);
                    GetComponent<Renderer>().material.color = redColour;
                    yield return new WaitForSeconds(0.1f);
                }
                GetComponent<Renderer>().material.color = Color.white;

                isHit = false;
            }
        }
    }
	
	// Update is called once per frame
	void Update () {
	
	}
}
