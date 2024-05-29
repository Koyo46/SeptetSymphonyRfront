import React, { useState } from 'react';

const HandCards = ({ handCards }: { handCards: Array<{[key: number]: {id: number, suit: number}}>} ) => {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

  const toggleCardSelection = (id: number,index: number,suit: number) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {// 新しいカードを選択する前に、条件をチェック
        if (prev.size > 0) {
          let canSelect = false;
          // 選択されているカードのIDを確認し、条件に合うかチェック
          prev.forEach(selectedId => {
            const selectedIndex = handCards.findIndex(cardObject => Object.values(cardObject)[0].id === selectedId);
            const selectedNumber = Object.values(handCards[selectedIndex])[0].suit;
            // 選択されているカードが隣り合っていて同じ数字かどうかをチェック
            if ((Math.abs(selectedIndex - index) === 1) && (selectedNumber === suit)) {
              canSelect = true;
            }
          });
          if (canSelect) {
            newSet.add(id);
          }
        } else {
          // まだ何も選択されていない場合は、最初のカードを自由に選択可能
          newSet.add(id);
        }
      }
      return newSet;
    });
  };

  return (
    <div className="flex">
      {handCards.map((cardObject, index) => {
        const [key, card] = Object.entries(cardObject)[0];
        const id = card.id;
        const suit = card.suit;
        const isSelected = selectedCards.has(id);

        return (
          <div key={id} 
               className={`card w-12 h-24 flex items-center justify-center border m-1 ${isSelected ? 'bg-blue-500' : ''}`}
               onClick={() => toggleCardSelection(id,index,suit)}>
            <span className="card-suit">{suit}</span>
          </div>
        );
      })}
    </div>
  );
}

export default HandCards;