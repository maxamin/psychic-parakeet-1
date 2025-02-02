"""
The Python script to test if the user successfully logs in.
"""

import requests
from bs4 import BeautifulSoup

def send_post(username, password):
    URL = "http://localhost/login.php"
    HOME_URL = "http://localhost/home.php"
    PARAMS = {'username':username, 'password':password}

    session = requests.session()
    
    session.post(URL, data = PARAMS)

    r = session.get(HOME_URL)

    return r.text

def send_bad_post(username, password):
    URL = "http://localhost/login.php"
    PARAMS = {'username':username, 'password':password}

    r = requests.post(url = URL, data = PARAMS)

    return r.text

def test_successful_login():
    r = send_post("moocow", "password")
    soup = BeautifulSoup(r, "html.parser")

    assert "Welcome" in soup.h1.text.strip() 

def test_bad_username():
    r = send_bad_post("baduser", "password")
    soup = BeautifulSoup(r, "html.parser")

    assert soup.span.text.strip() == "The username or password you entered was not valid."

def test_bad_password():
    r = send_bad_post("moocow", "badpassword")
    soup = BeautifulSoup(r, "html.parser")
    for i in soup.find_all('span'):
        if i.text != "":
            assert i.text.strip() == "The username or password you entered was not valid."

if __name__ == '__main__':
    test_successful_login()
    test_bad_username()
    test_bad_password()