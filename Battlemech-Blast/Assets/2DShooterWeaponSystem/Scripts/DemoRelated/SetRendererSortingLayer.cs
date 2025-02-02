using UnityEngine;
using System.Collections;

/// <summary>
/// Basic component used to set particle renderer sorting layers (legacy) for demo scene usage.
/// </summary>
[RequireComponent(typeof(ParticleSystem))]
public class SetRendererSortingLayer : MonoBehaviour
{
    public string sortingLayerName;
    public int sortingLayerId;

    // Use this for initialization
    void Start()
    {
        var particleRenderer = gameObject.GetComponent<ParticleSystem>().GetComponent<Renderer>();

        if (particleRenderer != null)
        {
            particleRenderer.sortingLayerName = sortingLayerName;
            particleRenderer.sortingOrder = sortingLayerId;
        }
    }
}
