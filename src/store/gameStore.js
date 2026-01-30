import { create } from 'zustand';
import { generateDeck } from '../utils/deck';
import { calculateScore } from '../utils/scoring';

export const useGameStore = create((set, get) => ({
  deck: [],
  players: [],
  activePlayerIndex: 0,
  gameStatus: 'LOBBY',
  isProcessing: false,
  roundNumber: 1,

  startGame: (names) => {
    const players = names.map(name => ({
      id: Math.random().toString(36),
      name,
      hand: [],
      bankedScore: 0,
      isActive: true,
      secondChances: 0,
      status: 'PLAYING'
    }));
    set({ deck: generateDeck(), players, activePlayerIndex: 0, gameStatus: 'PLAYING', isProcessing: false, roundNumber: 1 });
  },

  hit: () => {
    const { deck, players, activePlayerIndex, isProcessing } = get();
    if (isProcessing) return;

    const newDeck = [...deck];
    const card = newDeck.pop();
    if (!card) return;

    const newPlayers = [...players];
    const player = { ...newPlayers[activePlayerIndex] };
    const hand = [...player.hand];

    hand.push(card);
    player.hand = hand;

    let triggerFlip3 = false;
    let turnShouldEnd = false;

    if (card.type === 'ACTION') {
      if (card.action === 'FREEZE') {
        player.isActive = false;
        turnShouldEnd = true;
      } else if (card.action === 'FLIP_THREE') {
        triggerFlip3 = true;
      } else if (card.action === 'SECOND_CHANCE') {
        if (player.secondChances === 0) {
          player.secondChances = 1;
        } else {
          let targetIdx = (activePlayerIndex + 1) % newPlayers.length;
          for (let i = 0; i < newPlayers.length; i++) {
            if (newPlayers[targetIdx].isActive && newPlayers[targetIdx].secondChances === 0) {
              newPlayers[targetIdx].secondChances = 1;
              break;
            }
            targetIdx = (targetIdx + 1) % newPlayers.length;
          }
          hand.pop(); 
          player.hand = hand;
        }
      }
    } else if (card.type === 'NUMBER') {
      const numbersInHand = hand.filter(c => c.type === 'NUMBER');
      const isDuplicate = numbersInHand.slice(0, -1).some(c => c.value === card.value);

      if (isDuplicate) {
        if (player.secondChances > 0) {
          player.secondChances = 0;
          const scIdx = hand.findIndex(c => c.action === 'SECOND_CHANCE');
          if (scIdx > -1) hand.splice(scIdx, 1);
          hand.pop();
          player.hand = hand;
        } else {
          player.isActive = false;
          turnShouldEnd = true;
        }
      }
    }

    const uniqueNumbers = new Set(hand.filter(c => c.type === 'NUMBER').map(c => c.value));
    if (uniqueNumbers.size >= 7 && player.isActive) {
      player.bankedScore += calculateScore(hand);
      player.isActive = false;
      player.status = 'WON_ROUND';
      turnShouldEnd = true;
    }

    newPlayers[activePlayerIndex] = player;
    set({ deck: newDeck, players: newPlayers });

    if (turnShouldEnd) {
      set({ isProcessing: true });
      setTimeout(() => {
        const finalPlayers = [...get().players];
        const p = finalPlayers[activePlayerIndex];
        
        if (p.status !== 'WON_ROUND') p.status = 'BUSTED';
        
        set({ players: finalPlayers });

        setTimeout(() => {
          if (p.bankedScore >= 200) {
            set({ gameStatus: 'GAME_OVER', isProcessing: false });
          } else {
            const resetPlayers = [...get().players];
            resetPlayers[activePlayerIndex].hand = [];
            set({ players: resetPlayers, isProcessing: false });
            get().nextTurn();
          }
        }, 100);
      }, 100); 
    } else if (triggerFlip3) {
      get().resolveFlipThree(3);
    }
  },

  resolveFlipThree: (count) => {
    if (count <= 0) return;
    set({ isProcessing: true });
    setTimeout(() => {
      const { players, activePlayerIndex } = get();
      if (!players[activePlayerIndex].isActive) {
        set({ isProcessing: false });
        return;
      }
      set({ isProcessing: false });
      get().hit();
      get().resolveFlipThree(count - 1);
    }, 1000);
  },

  stay: () => {
    const { players, activePlayerIndex } = get();
    const newPlayers = [...players];
    const player = { ...newPlayers[activePlayerIndex] };
    player.bankedScore += calculateScore(player.hand);
    player.hand = [];
    player.isActive = false;
    player.status = 'FOLDED';
    newPlayers[activePlayerIndex] = player;
    set({ players: newPlayers });
    if (player.bankedScore >= 200) set({ gameStatus: 'GAME_OVER' });
    else get().nextTurn();
  },

  nextTurn: () => {
    const { players, activePlayerIndex } = get();
    let next = (activePlayerIndex + 1) % players.length;
    let count = 0;
    while (!players[next].isActive && count < players.length) {
      next = (next + 1) % players.length;
      count++;
    }
    if (count === players.length) {
      const winner = players.find(p => p.bankedScore >= 200);
      if (winner) set({ gameStatus: 'GAME_OVER' });
      else set({ players: players.map(p => ({ ...p, isActive: true, hand: [], status: 'PLAYING', secondChances: 0 })), activePlayerIndex: 0, roundNumber: get().roundNumber + 1 });
    } else {
      set({ activePlayerIndex: next });
    }
  },

  resetGame: () => get().startGame(get().players.map(p => p.name))
}));