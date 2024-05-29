import React, { useEffect, useState } from 'react'
import Deck from '../Components/Deck'
import HandCards from '../Components/HandCards'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import usePusher from '../hooks/usePusher';

const GamePlay = () => {
    const gameId = useParams().gameId || "";
    const channel = usePusher("game." + gameId);
    const playerCount = parseInt(useParams().playerCount || "0");
    const [dealed, setDealed] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [currentRound, setCurrentRound] = useState(0);
    // セキュリティ: APIエンドポイントにアクセスする際は、適切な認証と認可を実装することが重要です。例えば、JWT (JSON Web Tokens) を使用して、リクエストが正当なユーザーから発されていることを確認します。
    const [handCards, setHandCards] = useState<Array<{[key: number]: {id: number, suit: number}}>>([]);
    
    const fetchMyHandCards = async () => {
        try {
            const response = await axios.get(
                `/api/game/${gameId}/myHandCards`,
                {
                    headers: {
                        "X-Session-ID": sessionStorage.getItem("sessionId"),
                    },
                }
            );
            console.log(response.data);
            setHandCards(response.data.handCards);
        } catch (error) {
            console.error('手札の取得に失敗しました:', error);
        }
    };
    
    const DealCards  = async () => {
        try {
            const response = await axios.post(
                "/api/game/deal",
                {
                    gameId: gameId,
                    playerCount: playerCount,
                },
                {
                    headers: {
                        "X-Session-ID": sessionStorage.getItem("sessionId"),
                    },
                }
            );
            setCurrentPlayer(response.data.currentPlayer);
            setCurrentRound(response.data.currentRound);
            setDealed(true);
        } catch (error) {
            console.error(error);
        }
    }
    const DrawCard = () => {
        console.log("カードを引く");
    }

    useEffect(() => {
        fetchMyHandCards();
        console.log(handCards);
    }, [dealed]);

    useEffect(() => {
        if (channel) {
            channel.bind('dealed-card', (data: any) => {
                setDealed(true);
            });
        }
    }, [channel]);

    return(
    <div>
        <button onClick={DealCards}>カードを配る</button>
        <div className="flex space-x-2.5">
            <button onClick={DrawCard} className="bg-blue-500 text-white font-bold py-4 px-2 rounded w-16 h-32">
                カードを引く
            </button>
            <div className="w-16 h-32 bg-gray-300 rounded">場</div>
            <div className="w-16 h-32 bg-gray-500 rounded">捨て札</div>
        </div>
        {dealed && (
            <>
                <HandCards handCards={handCards} />
            </>
        )}
    </div>
    )
}

export default GamePlay