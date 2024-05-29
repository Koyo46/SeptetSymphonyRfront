import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";

function CreateGame({}) {
    const [playerCount, setPlayerCount] = useState(4);
    const [gameId, setGameId] = useState(1);
    const navigate = useNavigate();

    const createGame = async () => {
        try {
            const response = await axios.post("/api/game/createGame", {
                playerCount,
                gameId,
            });
            setGameId(response.data.gameId);
            navigate(`/gameTable/${response.data.gameId}/${playerCount}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <select
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                className="border-2 border-gray-300 rounded-md p-2"
            >
                <option value={2}>2 players</option>
                <option value={3}>3 players</option>
                <option value={4}>4 players</option>
                <option value={5}>5 players</option>
                <option value={6}>6 players</option>
                {/* Add more options as needed */}
            </select>
            <button
                style={{
                    backgroundColor: "#ff6347" /* 背景色 */,
                    color: "white" /* 文字色 */,
                    padding: "10px" /* パディング */,
                    borderRadius: "5px" /* 角の丸み */,
                    border: "none" /* ボーダー */,
                    cursor: "pointer" /* カーソル */,
                    fontSize: "15px" /* フォントサイズ */,
                }}
                onClick={createGame}
            >
                卓を作る
            </button>
        </div>
    );
}

export default CreateGame;
