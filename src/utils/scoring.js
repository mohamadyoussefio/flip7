export const calculateScore = (hand) => {
  if (!hand || hand.length === 0) return 0;

  let totalScore = hand
    .filter((card) => card.type === "NUMBER")
    .reduce((sum, card) => sum + card.value, 0);

  const hasMultiplier = hand.some(
    (card) => card.action === "DOUBLE" || card.label === "x2",
  );
  if (hasMultiplier) {
    totalScore *= 2;
  }

  const additions = hand
    .filter((card) => card.type === "MODIFIER" && card.label.startsWith("+"))
    .reduce((sum, card) => {
      const value = parseInt(card.label.replace("+", ""), 10);
      return sum + value;
    }, 0);

  totalScore += additions;

  const uniqueNumbers = new Set(
    hand.filter((card) => card.type === "NUMBER").map((card) => card.value),
  );

  if (uniqueNumbers.size >= 7) {
    totalScore += 15;
  }

  return totalScore;
};
