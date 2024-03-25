# 🚢 Navallium 💣

> Navallium is a game made for the Instituto Metrópole Digital/UFRN IT bachelor's chair called Multiusers Network Games.

## Technology

There are only two technical requirements for the Navallium development.

1. Use JavaScript/TypeScript
2. Use WebSockets

### Frontend

For the Frontend I choose to use:
- Vue 3 and TypeScript
- Pinia for state management
- Vue Router for routing
- Vuetify as the component library

### Backend

For the Backend I choose to use:

- TypeScript
- Only NodeJS (without a framework like Nest or Express)

## How to run

- Clone this repo
- Create a `.env` file into the `/front` folder as a copy of `.env.sample`
- Choose the value that you want to use as the Server endpoint

> 💡 If you want to use the app locally only, set as `localhost`, but if you want to expose it, switch to your IP, or some other available endpoint.

### Running frontend

```bash
cd ./front
npm i
npm run dev           # running locally
npm run dev:expose    # expose app on local network
```

### Running backend

```bash
cd ./back
npm i
npm run start:dev     # watch mode
npm run start         # default mode
```

## How to play

1. Access the page
2. Enter your name
3. Click on "Enter" button
4. You'll receive a code (as well as your friend)
5. Enter your friend's code, or send him yours
6. Click on Join or Accept the request
7. Place your ships on the board
8. Click on "I'm ready" button
9. Try to attack your friend by guessing where are his ships
10. The game ends when someone has been completely drowned (all ships are fully attacked)

## Future work

1. Improve security by adding authorization header
2. Improve layout with animations and more visual feedbacks
3. Add spectator mode

