## Contributing

```
# git clone https://github.com/haccn/xmpp-ftw
# cd xmpp-ftw
# cp src/config.example.ts src/config.ts
```

Next you'll probably want to install an XMPP server so you can test locally.

```
Debian
# sudo apt install prosody

Arch Linux
# sudo pacman -S prosody

Gentoo
# emerge --ask net-im/prosody

OpenBSD
# pkg_add prosody

Mac OS X
# brew tap prosody/prosody
# brew install prosody

Windows
Sucks
```

See https://prosody.im/download for a more extensive list.

Add some users to test with

```
# prosodyctl adduser a@localhost
# prosodyctl adduser b@localhost
```

Finally, run xmpp-ftw

```
# yarn run dev
```
