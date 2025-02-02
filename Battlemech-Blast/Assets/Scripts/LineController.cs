using UnityEngine;

public class LineController : MonoBehaviour
{
    public static LineController instance;
    private Transform[] points;
    private LineRenderer line;


    void Awake()
    {
        if (instance == null)
            instance = this;
        else Debug.Log("ther is an instance");
        line = GetComponent<LineRenderer>();

    }

    void Update()
    {
        if (points != null)
        {
            for (int i = 0; i < points.Length; i++)
            {
                line.SetPosition(i, points[i].position);
            }

        }

    }
    public void GetLinePoints(Transform[] points)
    {
        line.positionCount = points.Length;
        this.points = points;
        Debug.Log("points replaced");


    }
}
