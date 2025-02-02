using System;
using UnityEngine;

public class CameraMovement : MonoBehaviour
{


    private Func<Vector3> GetCameraFollowPositionFunc;
    public float followSpeed = 1f;


    public void SetUp(Func<Vector3> GetCameraFollowPositionFunc)
    {
        this.GetCameraFollowPositionFunc = GetCameraFollowPositionFunc;
    }

    private void LateUpdate()
    {
        Vector3 cameraFollowPosition = GetCameraFollowPositionFunc();
        cameraFollowPosition.z = transform.position.z;

        Vector3 cameraMovDir = (cameraFollowPosition - transform.position).normalized;
        float distance = Vector3.Distance(cameraFollowPosition, transform.position);
        float cameraMoveSpeed = followSpeed;

        if (distance > 0)
        {
            Vector3 newCameraPosition = transform.position + cameraMovDir * distance * cameraMoveSpeed * Time.deltaTime;
            float distanceAfterMove = Vector3.Distance(newCameraPosition, cameraFollowPosition);

            if (distanceAfterMove > distance)
            {
                //Overshot the target
                newCameraPosition = cameraFollowPosition;
            }
            transform.position = newCameraPosition;

        }

    }
}
