using UnityEngine;
using System.Collections;

/// <summary>
/// Camera lerping script to get camera to smooth follow the player or other targets in demo scenes.
/// </summary>
public class CameraLerpToTransform : MonoBehaviour
{
    public Transform target;
    public float speed;
    public float cameraDepth = -10f;

    public float minX, minY, maxX, maxY;

    // Use this for initialization
    void Start()
    {
        // Hard code the extents of the play area for the demo...
        minY = -6.6f;
        minX = -3.38f;
        maxX = 3.1f;
        maxY = 2.6f;
    }

    // Update is called once per frame
    void Update()
    {
        var newPosition = Vector2.Lerp(transform.position, target.position, Time.deltaTime * speed);
        var camPosition = new Vector3(newPosition.x, newPosition.y, cameraDepth);

        var v3 = camPosition;
        var newX = Mathf.Clamp(v3.x, minX, maxX);
        var newY = Mathf.Clamp(v3.y, minY, maxY);
        transform.position = new Vector3(newX, newY, cameraDepth);
    }
}
