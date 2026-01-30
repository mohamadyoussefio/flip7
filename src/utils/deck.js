export const generateDeck = () => {
  const deck = [];
  const uuid = () => Math.random().toString(36).substring(2, 9);

  for (let i = 12; i >= 0; i--) {
    const count = i === 0 ? 1 : i;
    for (let j = 0; j < count; j++) {
      deck.push({
        id: uuid(),
        type: "NUMBER",
        value: i,
        label: i.toString(),
      });
    }
  }

  [2, 4, 6, 8, 10].forEach((val) => {
    deck.push({
      id: uuid(),
      type: "MODIFIER",
      value: val,
      label: `+${val}`,
    });
  });

  deck.push({
    id: uuid(),
    type: "MODIFIER",
    value: 0,
    isMultiplier: true,
    label: "x2",
  });

  const actions = [
    { label: "Freeze", type: "FREEZE" },
    { label: "Flip 3", type: "FLIP_THREE" },
    { label: "2nd Chance", type: "SECOND_CHANCE" },
  ];

  actions.forEach((action) => {
    for (let k = 0; k < 3; k++) {
      deck.push({
        id: uuid(),
        type: "ACTION",
        value: 0,
        action: action.type,
        label: action.label,
      });
    }
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};
