# FLIP 7 | Professional Edition

A digital implementation of the Flip 7 card game, developed using React 19 and Next.js 15. This project is designed to offer a modern, minimalist user experience while remaining strictly compliant with the official game rules.

---

## Play Online

The latest version of the game is deployed and playable at: https://flip7.mohamadyoussef.com 

----

## Game Objective
Flip 7 is a "Press Your Luck" style game.
* [cite_start]**Goal**: Be the first player to reach 200 points to trigger the final scoring round[cite: 7].
* [cite_start]**The Risk**: If you draw a card with the same value as a card already in your row, you are eliminated for the round and lose all points accumulated during that turn[cite: 11].
* [cite_start]**The Bonus**: Successfully flipping 7 unique number cards in your row immediately ends the round for all players and awards a 15-point bonus[cite: 10, 138].

---

### 1. Gameplay Logic
* **Flip 7 Priority**: The "Flip 7" success takes priority over all active sequences. [cite_start]If the 7th unique card is drawn during a Flip Three action, the sequence stops immediately[cite: 102].
* [cite_start]**Freeze**: The player receiving this card loses all accumulated points for the turn and is eliminated for the remainder of the round[cite: 99].
* **Second Chance**: Provides protection against the first duplicate card. [cite_start]Per the rules, a player may only have one Second Chance card at a time[cite: 110]. [cite_start]If a second one is drawn, it must be transferred to another active player[cite: 111].

### 2. Scoring Algorithm
Points are calculated following the strict mathematical order imposed by the modifiers:
1. [cite_start]**Base Sum**: Total of all number cards (the 0 card is worth 0 points)[cite: 40, 80].
2. [cite_start]**x2 Multiplier**: Doubles only the score of the number cards; it does not affect fixed modifiers[cite: 117, 118].
3. [cite_start]**Fixed Bonuses**: Addition of modification cards ranging from +2 to +10[cite: 116].
4. [cite_start]**Flip 7 Premium**: Addition of the final 15-point bonus[cite: 138].

---
## Installation

### Clean Architecture
This repository is configured to respect academic constraints (no node_modules or .next folders in the Git history).

1. Clone the project.
```bash
git clone https://github.com/mohamadyoussefio/flip7.git
cd flip7
```
2. Install dependencies:
   ```bash
   npm install:
3. Launch the application
```bash
npm run dev
```
4. Test: Access the game at http://localhost:3000
