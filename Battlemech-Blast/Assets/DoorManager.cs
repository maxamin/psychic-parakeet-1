using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class DoorManager : MonoBehaviour
{


    public string nextScene;

    public string CurrentSceneName()
    {
        return SceneManager.GetActiveScene().name;
    }

}
