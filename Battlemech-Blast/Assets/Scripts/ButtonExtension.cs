using System;
using UnityEngine.UI;

public static class ButtonExtension
{
    public static void AddEventListener<T>(this Button button, T param1, Action<T> OnClick)
    {
        button.onClick.AddListener(delegate ()
        {
            OnClick(param1);

        });

    }

}
