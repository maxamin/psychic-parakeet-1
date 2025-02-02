using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
using TMPro;
public class AuthenticationManager : MonoBehaviour
{

    private Dictionary<string, string> identification = new Dictionary<string, string>();
    private string[] waxWalletArray = new string[] {
        ".hejg.wam",
        ".hejg.wam",
        ".p2bu.wam",
        ".p2bu.wam",
        ".r4uc.wam",
        ".r4uc.wam",
        ".w4rg.wam",
        ".w4rg.wam",
        ".wyaw.wam",
        ".wyaw.wam",
        "13eb.wam",
        "13eb.wam",
        "1u.rw.wam",
        "1u.rw.wam",
        "2.gra.wam",
        "2.gra.wam",
        "2qw44.c.wam",
        "2qw44.c.wam",
        "2ryr.wam",
        "2ryr.wam",
        "3nrr.wam",
        "3nrr.wam",
        "4ibci.wam",
        "4ibci.wam",
        "55kvo.wam",
        "55kvo.wam",
        "55lqq.wam",
        "55lqq.wam",
        "5icqy.wam",
        "5icqy.wam",
        "5pqqy.wam",
        "5pqqy.wam",
        "5xwkm.wam",
        "5xwkm.wam",
        "a1hd.wam",
        "a1hd.wam",
        "ancyw.wam",
        "ancyw.wam",
        "baymaxvalero",
        "baymaxvalero",
        "brhb.wam",
        "brhb.wam",
        "cwzqw.wam",
        "cwzqw.wam",
        "czdqw.wam",
        "czdqw.wam",
        "dkgbw.wam",
        "dkgbw.wam",
        "drs3g.c.wam",
        "drs3g.c.wam",
        "ds.qw.wam",
        "ds.qw.wam",
        "e.q.2.c.wam",
        "e.q.2.c.wam",
        "fs1r2.wam",
        "fs1r2.wam",
        "fwdz2.wam",
        "fwdz2.wam",
        "hdars.wam",
        "hdars.wam",
        "hfe32.c.wam",
        "hfe32.c.wam",
        "hpdhk.wam",
        "hpdhk.wam",
        "i4p3u.c.wam",
        "i4p3u.c.wam",
        "idync.c.wam",
        "idync.c.wam",
        "ifaay.wam",
        "ifaay.wam",
        "ijqrk.wam",
        "ijqrk.wam",
        "j23seventeen",
        "j23seventeen",
        "j2uwc.wam",
        "j2uwc.wam",
        "jonl..c.wam",
        "jvmom.c.wam",
        "jvmom.c.wam",
        "kg5ey.wam",
        "kg5ey.wam",
        "lmxb2.wam",
        "lmxb2.wam",
        "lrprg.wam",
        "lrprg.wam",
        "ma4qw.wam",
        "ma4qw.wam",
        "n3ln4.c.wam",
        "n3ln4.c.wam",
        "nblig.wam",
        "nblig.wam",
        "nd5aw.wam",
        "nd5aw.wam",
        "nlfaw.wam",
        "nlfaw.wam",
        "nsdbk.wam",
        "nsdbk.wam",
        "ockaq.wam",
        "ockaq.wam",
        "officialtako",
        "officialtako",
        "pec4a.c.wam",
        "pec4a.c.wam",
        "phlbq.wam",
        "phlbq.wam",
        "qwkra.wam",
        "qwkra.wam",
        "redro.gm",
        "redro.gm",
        "rp422.c.wam",
        "rp422.c.wam",
        "rr3qw.wam",
        "rr3qw.wam",
        "rspay.wam",
        "rspay.wam",
        "s.r.u.c.wam",
        "s.r.u.c.wam",
        "s4g3c.c.wam",
        "s4g3c.c.wam",
        "sdmeanu12345",
        "sdmeanu12345",
        "snappehgames",
        "snappehgames",
        "stadium.gm",
        "stadium.gm",
        "tricky.gm",
        "tricky.gm",
        "txyqw.wam",
        "txyqw.wam",
        "ud3wu.wam",
        "ud3wu.wam",
        "ufuau.wam",
        "ufuau.wam",
        "ux1ru.wam",
        "ux1ru.wam",
        "ve41k.c.wam",
        "ve41k.c.wam",
        "vvrva.wam",
        "vvrva.wam",
        "w35r.wam",
        "w35r.wam",
        "whsug.wam",
        "whsug.wam",
        "xmzr2.wam",
        "xmzr2.wam",
        "ynjee.wam",
        "ynjee.wam",
        "5qfew.wam",
        "lyaos.c.wam",
        "lyaos.c.wam",
        "ud3wu.wam",
        "ud3wu.wam",
        "5uzr.wam",
        "5uzr.wam",
        ".1md2.wam",
        "d4y.2.c.wam",
        "d4y.2.c.wam",
        "sdmeanu12345",
        "a1hd.wam",
        "ancyw.wam",
        "ancyw.wam",
        "olrqy.wam",
        "olrqy.wam",
        "xmzr2.wam",
        "xmzr2.wam",
        "nr4xg.wam",
        "5pqqy.wam",
        "5pqqy.wam",


    };
    private string[] usernameArray = new string[] {
        "m.s.parlevliet@hotmail.com",
        "MParle",
        "laurent.blaz@gmail.com",
        "fury",
        "mikigomez8921@gmail.com",
        "Raspache",
        "chrisone11@hotmail.com",
        "Moepro",
        "tbone.asurown@gmail.com",
        "420fairieT",
        "minokasky@gmail.com",
        "Minoka Sky",
        "digbysharples@gmail.com",
        "OGKiDZ",
        "olegvolodarskiy@gmail.com",
        "Mirrox",
        "brak.smurf@gmail.com",
        "Brak",
        "Jesstrick.jt@gmail.com",
        "TrickyB",
        "VeronicaMurillo",
        "meowcloudmeow@gmail.com",
        "jonas_inline@hotmail.com",
        "MadJonas",
        "Carrollmitchell3@gmail.com",
        "Coocfoceoroy",
        "SheFF",
        "v7273371@gmail.com",
        "kittydusya@gmail.com",
        "VirtualCat",
        "digitmedia01@gmail.com",
        "Deny07",
        "bulygin.ivan@gmail.com",
        "megabars1k",
        "syonidehyde@gmail.com",
        "Sublimesounds",
        "nicosniper7@msn.com",
        "snip",
        "valerorandy45@gmail.com",
        "baymaxvalero",
        "dadamoniki93@gmail.com",
        "David Wilchip",
        "danjorda2@gmail.com",
        "danjo",
        "ong1st",
        "jbongbc@gmail.com",
        "el.manolo.23@gmail.com",
        "manolo23",
        "datisib305@alvisani.com",
        "Waxunter",
        "richard_smet@hotmail.com",
        "0M3GA",
        "VideoGameMessiah",
        "Krazyk2580@yahoo.com",
        "Muenster",
        "Muenstervision@gmail.com",
        "ilshatko21@gmail.com",
        "Gadzho",
        "joetssteel@yahoo.com",
        "4thwall",
        "gnokendaoart@gmail.com",
        "GNOKENDAO",
        "jpmp24@msn.com",
        "hpdhk.wam",
        "Warphix71@gmail.com",
        "Bulbi",
        "Apostas13@gmail.com",
        "Rsarafas",
        "lucaschabbat@live.fr",
        "Kukus",
        "cmcski123@yahoo.com",
        "cmcski123",
        "pauly46@gmail.com",
        "723seventeen",
        "hfmikedinero@gmail.com",
        "olrusty",
        "lrbrtms@aol.com",
        "antonioranto@yahoo.com",
        "Ranto",
        "texel13@gmail.com",
        "globalimt",
        "ahujaash@gmail.com",
        "Mikel",
        "dborjspenarts@gmail.com",
        "DBorjs",
        "hofesh_arshav@hotmail.com",
        "ZOliDNetwork Bitcoin Kids",
        "qudusadedamola@gmail.com",
        "Qudusadedamola",
        "Wizzapizza808@gmail.com",
        "WizzaPizza",
        "babbutmuttalinen@gmail.com",
        "nd5aw.wam",
        "adammead2496@gmail.com",
        "Adamantium",
        "balcomes@gmail.com",
        "Ezren",
        "Benjitheclown@gmail.com",
        "Necroclown",
        "runthecoins@gmail.com",
        "MechaTako",
        "sercullen@googlemail.com",
        "BIG POPPA",
        "4mjam4@gmail.com",
        "MjaM",
        "nvlad7688@gmail.com",
        "Vitas",
        "rohansandt@gmail.com",
        "RED",
        "mckeec10@gmail.com",
        "R43",
        "harris.dave38@gmail.com",
        "TheRedWizard",
        "mac_sanches@yahoo.com",
        "Boomshankaar",
        "Central",
        "cenas.nmcb5@gmail.com",
        "uwadepakmen",
        "uwadepakmen90@gmail.com",
        "anishdas1920@gmail.com",
        "sdme123",
        "snappsiz91@gmail.com",
        "Snappeh",
        "TheAgency",
        "neatnfts@gmail.com",
        "Mike.A.Trick@gmail.com",
        "Tricky",
        "mishaauto111@gmail.com",
        "mish",
        "mohammad.taheriii@protonmail.com",
        "kurush1",
        "thelovehandlz@gmail.com",
        "LoveHandlz",
        "hyz.yanuy@gmail.com",
        "yanuy",
        "Mitpat21@gmail.com",
        "MWParadigm",
        "gan174.82@gmail.com",
        "GAN174",
        "pierreantoinelamothe@gmail.com",
        "LamotheOfficial",
        "huruko47@gmail.com",
        "Huruko",
        "madhuriinua@gmail.com",
        "NoNameAMiGO",
        "Lronhodler@gmail.com",
        "SirLRonHODLer",
        "Missy",
        "ehssan",
        "wax.cloud.wallet4@gmail.com",
        "taheri",
        "only.for.airdropp@gmail.com",
        "michaelminter@rocketmail.com",
        "JUGGALIZZLE",
        "komik61285@gmail.com",
        "aone",
        "netsurfers@163.com",
        "anishdas1920@gmail.com",
        "sublimesounds",
        "nicosniper7@msn.com",
        "snip",
        "ackmanm28@gmail.com",
        "yycnft",
        "windanton478@gmail.com",
        "NoNameAmiGo",
        "ariefbayu@gmail.com",
        "digitmedia01@gmail.com",
        "deny07",
    };


    public string myUsername { get; private set; }
    public string myWaxWallet { get; private set; }


    public TextMeshProUGUI loginStatus;
    [SerializeField] private InputField usernameInput;
    [SerializeField] private InputField waxWalletInput;

    private void Awake()
    {
        for (int i = 0; i < usernameArray.Length; i++)
        {
            identification.Add(usernameArray[i], waxWalletArray[i]);
        }

    }

    void Start()
    {
        //Load username and wax wallet
        LoadAuth();

        //Login if you are already did
        LoginAuthenticator();

    }


    public void LoginAuthenticator()
    {
        string waxWalletValue;
        if (identification.TryGetValue(usernameInput.text, out waxWalletValue))
        {
            if (waxWalletValue == waxWalletInput.text)
            {
                //Log user in
                Debug.Log("Congrats! You are in");
                GUIManager.instance.ModeSelectionPanel.SetActive(true);
                this.gameObject.SetActive(false);
                SaveAuth(usernameInput.text, waxWalletValue);
                LoadAuth();
                return;
            }
        }
        Debug.Log("Wrong");

        loginStatus.text = "Incorrect settings";
    }

    public void SaveAuth(string username, string waxWallet)
    {
        PlayerPrefs.SetString("Username", username);
        PlayerPrefs.SetString("WaxWallet", waxWallet);
    }

    public void LoadAuth()
    {
        if (PlayerPrefs.HasKey("Username"))
        {
            myUsername = PlayerPrefs.GetString("Username");
            usernameInput.text = myUsername;
        }
        if (PlayerPrefs.HasKey("WaxWallet"))
        {
            myWaxWallet = PlayerPrefs.GetString("WaxWallet");
            waxWalletInput.text = myWaxWallet;
        }
    }



}
