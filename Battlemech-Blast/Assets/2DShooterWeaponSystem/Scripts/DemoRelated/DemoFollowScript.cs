using System.Collections.Generic;
using UnityEngine;
using System.Collections;

/// <summary>
/// Used to get objects in some demo scenes to follow other targets.
/// </summary>
public class DemoFollowScript : MonoBehaviour {

    public Transform target;
    public float speed;
    public bool shouldFollow, isHomeAndShouldDeactivate, movingToDeactivationTarget;

    private Vector3 newPosition;

    public List<Transform> acquiredTargets;

    // Use this for initialization
    void Start()
    {
        isHomeAndShouldDeactivate = false;
        movingToDeactivationTarget = false;

        acquiredTargets = new List<Transform>();

        if (target == null)
        {
            Debug.Log("No target found for the FollowScript on: " + gameObject.name);
        }
    }

    void OnEnable()
    {

    }

    // Update is called once per frame
    void Update()
    {
        if (shouldFollow && target != null)
        {
            // We don't want to change our Z position (to keep sprite Z ordering correct), so we ignore the Z value coming in from the Vector2.Lerp below...
            newPosition = Vector2.Lerp(transform.position, target.position, Time.deltaTime * speed);
            transform.position = new Vector3(newPosition.x, newPosition.y, transform.position.z);
        }
    }

    void OnDisable()
    {
        target = null;
    }
}
