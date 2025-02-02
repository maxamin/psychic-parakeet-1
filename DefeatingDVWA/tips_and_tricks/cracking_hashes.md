# Cracking Password Hashes

In the SQLi section of DVWA we were able to retrieve a set of password hashes.

```
admin:5f4dcc3b5aa765d61d8327deb882cf99
gordonb:e99a18c428cb38d5f260853678922e03
1337:8d3533d75ae2c3966d7e0d4fcc69216b
pablo:0d107d09f5bbe40cade3de5c71e9e9b7
smithy:5f4dcc3b5aa765d61d8327deb882cf99
```

## The Lazy Way

If you're lucky enough to find a site that's still using unsalted md5 *(in 2014? really?)* to store passwords, there's reasonable chance that somebody else has already cracked that hash.

A lot of the time, if you have a bunch of hashes to crack, you can usually just Google it!

http://www.md5rainbow.com/5f4dcc3b5aa765d61d8327deb882cf99
... "password"

http://www.md5rainbow.com/e99a18c428cb38d5f260853678922e03
... "abc123"

http://www.md5rainbow.com/8d3533d75ae2c3966d7e0d4fcc69216b
... "charley"

http://www.md5rainbow.com/0d107d09f5bbe40cade3de5c71e9e9b7
... "letmein"

http://www.md5rainbow.com/5f4dcc3b5aa765d61d8327deb882cf99
... we've done this before. It's "password" again!

Thanks to the magic of people using awful passwords, we obtained all of the passwords with minimal effort.

```
admin:password
gordonb:abc123
1337:charley
pablo:letmein
smithy:password
```

## The Proper Way

We won't always be so lucky as to have easily googleable password hashes. I will use hashcat to break these the hard way!

hashes.txt
```
5f4dcc3b5aa765d61d8327deb882cf99
e99a18c428cb38d5f260853678922e03
8d3533d75ae2c3966d7e0d4fcc69216b
0d107d09f5bbe40cade3de5c71e9e9b7
5f4dcc3b5aa765d61d8327deb882cf99
```

```
 ~  $ hashcat hashes.txt passwords.txt
Initializing hashcat v0.47 by atom with 8 threads and 32mb segment-size...

Added hashes from file hashes.txt: 5 (1 salts)

NOTE: press enter for status-screen

5f4dcc3b5aa765d61d8327deb882cf99:password

Input.Mode: Dict (passwords.txt)
Index.....: 1/1 (segment), 26 (words), 194 (bytes)
Recovered.: 1/5 hashes, 0/1 salts
Speed/sec.: - plains, - words
Progress..: 26/26 (100.00%)
Running...: --:--:--:--
Estimated.: --:--:--:--

Started: Mon May  5 11:05:12 2014
Stopped: Mon May  5 11:05:12 2014
```

