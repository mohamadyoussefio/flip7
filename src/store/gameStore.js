import { create } from "zustand";
import { generateDeck } from "../utils/deck";
import { calculateScore } from "../utils/scoring";

export const useGameStore = create((set, get) => ({
  deck: [],
  players: [],
  activePlayerIndex: 0,
  gameStatus: "LOBBY",
  isProcessing: false,
  roundNumber: 1,
  logs: [],

  addLog: (msg) => set((state) => ({ logs: [`> ${msg}`, ...state.logs] })),

  startGame: (names) => {
    const players = names.map((name) => ({
      id: Math.random().toString(36),
      name,
      hand: [],
      bankedScore: 0,
      isActive: true,
      isFrozen: false,
      secondChances: 0,
      status: "PLAYING",
    }));

    set({
      deck: generateDeck(),
      players,
      activePlayerIndex: 0,
      gameStatus: "PLAYING",
      isProcessing: false,
      roundNumber: 1,
      logs: ["> SYSTÈME INITIALISÉ", "> MANCHE 1 LANCÉE"],
    });
  },

  hit: () => {
    const { deck, players, activePlayerIndex, isProcessing, addLog } = get();
    if (isProcessing) return;

    const newDeck = [...deck];
    const card = newDeck.pop();
    if (!card) return;

    const newPlayers = [...players];
    const player = { ...newPlayers[activePlayerIndex] };
    const hand = [...player.hand];

    hand.push(card);
    player.hand = hand;
    newPlayers[activePlayerIndex] = player;
    set({ deck: newDeck, players: newPlayers });
    addLog(`${player.name} a tiré [ ${card.label} ]`);

    let turnEnding = false;
    let delay = 0;
    let triggerFlip3 = false;

    if (card.type === "ACTION") {
      if (card.action === "FREEZE") {
        player.isFrozen = true;
        player.isActive = false;
        player.status = "BUSTED";
        turnEnding = true;
        delay = 2000;
        addLog(`GEL : ${player.name} est éliminé !`);
      } else if (card.action === "FLIP_THREE") {
        triggerFlip3 = true;
        addLog(`ACTION : ${player.name} doit piocher 3 cartes`);
      } else if (card.action === "SECOND_CHANCE") {
        if (player.secondChances === 0) {
          player.secondChances++;
          addLog(`ITEM : ${player.name} a une Seconde Chance`);
        } else {
          let targetIdx = (activePlayerIndex + 1) % newPlayers.length;
          let foundTarget = false;

          for (let i = 0; i < newPlayers.length; i++) {
            let p = newPlayers[targetIdx];
            if (p.isActive && p.secondChances === 0) {
              p.secondChances++;
              addLog(`TRANSFERT : Seconde Chance donnée à ${p.name}`);
              foundTarget = true;
              break;
            }
            targetIdx = (targetIdx + 1) % newPlayers.length;
          }

          if (!foundTarget) {
            addLog(`INFO : Pas de cible valide, Seconde Chance défaussée`);
          }
          hand.pop();
          player.hand = hand;
        }
      }
    } else if (card.type === "NUMBER") {
      const isDuplicate = hand
        .slice(0, -1)
        .some((c) => c.type === "NUMBER" && c.value === card.value);

      if (isDuplicate) {
        if (player.secondChances > 0) {
          player.secondChances--;
          const scIdx = hand.findIndex((c) => c.action === "SECOND_CHANCE");
          if (scIdx > -1) hand.splice(scIdx, 1);
          hand.pop();
          player.hand = hand;
          newPlayers[activePlayerIndex] = player;
          set({ players: newPlayers });
          addLog(`SAUVETAGE : ${player.name} utilise sa Seconde Chance !`);
          return;
        } else {
          player.isActive = false;
          player.status = "BUSTED";
          turnEnding = true;
          delay = 2500;
          addLog(`ÉCHEC : ${player.name} a fait un doublon !`);
        }
      } else {
        const uniqueNumbers = new Set(
          hand.filter((c) => c.type === "NUMBER").map((c) => c.value),
        );
        if (uniqueNumbers.size >= 7) {
          player.bankedScore += calculateScore(hand);
          player.isActive = false;
          player.status = "WON_ROUND";
          turnEnding = true;
          delay = 3000;
          addLog(`FLIP 7 ! Bonus de 15 points pour ${player.name} !`);

          if (player.bankedScore >= 200) {
            set({ players: newPlayers, isProcessing: true });
            setTimeout(
              () => set({ gameStatus: "GAME_OVER", isProcessing: false }),
              1500,
            );
            return;
          }
        }
      }
    }

    newPlayers[activePlayerIndex] = player;
    set({ players: newPlayers });

    if (triggerFlip3) {
      get().resolveFlipThree(3);
      return;
    }

    if (turnEnding) {
      set({ isProcessing: true });
      setTimeout(() => {
        const currentPlayers = [...get().players];
        const currentP = { ...currentPlayers[activePlayerIndex] };
        currentP.hand = [];
        currentP.status = "PLAYING";
        currentPlayers[activePlayerIndex] = currentP;
        set({ players: currentPlayers });
        get().nextTurn();
      }, delay);
    }
  },

  resolveFlipThree: (cardsLeft) => {
    if (cardsLeft <= 0) {
      set({ isProcessing: false });
      return;
    }
    set({ isProcessing: true });
    setTimeout(() => {
      const { players, activePlayerIndex } = get();
      const currentPlayer = players[activePlayerIndex];
      if (
        !currentPlayer.isActive ||
        currentPlayer.status === "BUSTED" ||
        currentPlayer.status === "WON_ROUND"
      ) {
        set({ isProcessing: false });
        return;
      }
      set({ isProcessing: false });
      get().hit();
      const updatedPlayer = get().players[activePlayerIndex];
      const uniqueNumbers = new Set(
        updatedPlayer.hand
          .filter((c) => c.type === "NUMBER")
          .map((c) => c.value),
      );
      if (uniqueNumbers.size >= 7) {
        set({ isProcessing: false });
        return;
      }
      if (updatedPlayer.isActive && updatedPlayer.status !== "BUSTED") {
        get().resolveFlipThree(cardsLeft - 1);
      }
    }, 800);
  },

  stay: () => {
    const { players, activePlayerIndex, addLog } = get();
    const newPlayers = [...players];
    const player = { ...newPlayers[activePlayerIndex] };

    const score = calculateScore(player.hand);
    player.bankedScore += score;
    player.hand = [];
    player.isActive = false;
    player.status = "FOLDED";

    addLog(`${player.name} s'arrête avec ${score} pts.`);
    newPlayers[activePlayerIndex] = player;
    set({ players: newPlayers });

    if (player.bankedScore >= 200) {
      set({ gameStatus: "GAME_OVER" });
    } else {
      get().nextTurn();
    }
  },

  nextTurn: () => {
    const { players, activePlayerIndex, addLog } = get();
    let nextIndex = (activePlayerIndex + 1) % players.length;
    let attempts = 0;

    while (!players[nextIndex].isActive && attempts < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      attempts++;
    }

    if (attempts === players.length) {
      const winner = players.find((p) => p.bankedScore >= 200);
      if (winner) {
        set({ gameStatus: "GAME_OVER", isProcessing: false });
        return;
      }

      const resetPlayers = players.map((p) => ({
        ...p,
        isActive: true,
        isFrozen: false,
        hand: [],
        status: "PLAYING",
        secondChances: 0,
      }));

      const nextRound = (get().roundNumber || 1) + 1;
      addLog(`--- MANCHE ${nextRound} ---`);
      set({
        players: resetPlayers,
        activePlayerIndex: 0,
        isProcessing: false,
        roundNumber: nextRound,
      });
    } else {
      set({ activePlayerIndex: nextIndex, isProcessing: false });
    }
  },

  resetGame: () => get().startGame(get().players.map((p) => p.name)),
}));
