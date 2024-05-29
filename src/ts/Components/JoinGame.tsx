import React from "react";
import axios from "axios";
import { useState } from "react";

function JoinGame({}) {
    const [gameId, setGameId] = useState("");

    const joinGame = async () => {
        try {
            const response = await axios.post("/api/game/joinGame", {
                gameId,
            });
            window.location.href = "/game/" + gameId;
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="お店IDを入力"
                className="border-2 border-gray-300 rounded-md p-2"
            />
            <button onClick={joinGame}>卓を見つける</button>
        </div>
    );
}

export default JoinGame;
