## Contributing

```
# git clone https://github.com/haccn/xmpp-ftw
# cd xmpp-ftw
# cp src/config.example.ts src/config.ts
```

Next you'll probably want to install an XMPP server so you can test locally.

```
Arch Linux
# sudo pacman -S prosody
OpenBSD
# pkg_add prosody
```

> If you know how do do this on other operating systems, please submit a PR.

Add some users to test with

```
# prosodyctl adduser billy@localhost
```

Finally, run xmpp-ftw

```
NPM
# npm run dev
Yarn
# yarn run dev
```
