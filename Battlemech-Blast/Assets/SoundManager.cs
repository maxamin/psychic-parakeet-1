using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundManager : MonoBehaviour
{
    public static AudioClip buttonClick, completeSound, collectSound;
    public static AudioSource audioSrc;
    
    public AudioSource soundTrackAudioSource;

    private AudioClip[] soundtrackClips;
    private int currentSongIndex = 0;

    void Awake()
    {
        //DontDestroyOnLoad(this.gameObject);
    }

    void Start()
    {
        buttonClick = Resources.Load<AudioClip>("Soundtracks/buttonclick");
        soundtrackClips = Resources.LoadAll<AudioClip>("Soundtracks/");

        audioSrc = GetComponent<AudioSource>();
    }
    private void Update()
    {
        LoopSongs();
    }
    public void LoopSongs()
    {
        if (!soundTrackAudioSource.isPlaying)
        {
            soundTrackAudioSource.clip = soundtrackClips[currentSongIndex];
            soundTrackAudioSource.Play();
            if (currentSongIndex < soundtrackClips.Length-1)
                currentSongIndex++;
            else
                currentSongIndex = 0;
        }
    }


    public static void ExitSound()
    {
        audioSrc.Stop();
        audioSrc.clip = null;
    }
    public static void PlaySound(string clip)
    {
        switch (clip)
        {
            case "buttonclick":
                audioSrc.PlayOneShot(buttonClick);
                break;
            default:
                audioSrc.clip = null;
                break;
        }
    }
}
