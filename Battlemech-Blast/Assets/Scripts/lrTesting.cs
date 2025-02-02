using UnityEngine;

public class lrTesting : MonoBehaviour
{



    public Transform[] points;

    void Start()
    {
        LineController.instance.GetLinePoints(points);
    }
}
