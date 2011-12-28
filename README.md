Memecached
==========

Love **memes**? 

Want to generate memes and share them with everyone in **real-time**? 

Use **Memecached**.

## About

Memecached is an **extremely** lightweight meme sharing service, written entirely in Javascript. The server itself, `app.js`, is exactly 50 lines of code.<br>
All meme images are stored in a public Dropbox directory. It differs from conventional meme generator apps in that there is **zero** server-side image handling code.<br>
Memes are shared in real-time using `now.js`, so once you hit **Publish**, everyone who is connected will see your meme image pop itself into the list.

## How it works

All meme template images are stored on Dropbox.

- When a new meme is published, the server takes a JSON object from the client, containing the meme `name` and `text`. No image whatsoever.

- The received meme object is inserted into the mongo collection `memes` with a date timestamp added to it. The object is also sent to all connected clients immediately so that they may update their timelines. This also means that no further database queries are required to retrieve new memes.

- When a client connects, the last few (25) memes are queried from the database and sent back. This can further be optimized by having an in-memory queue of the most recent memes, in addition to the database.

- All meme generation is done entirely **client-side**, by drawing the text over the images using **Canvas**. The client doesn't have to download images, and the server doesn't have to handle them at all.

## How to run

1. First, run `mongod` to start the Mongo daemon.
2. Next, run the server: `node app.js`
3. Point your browser to `http://localhost:8080`.
4. Bask in Memetic paradise.
