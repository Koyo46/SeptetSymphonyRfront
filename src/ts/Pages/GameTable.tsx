import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pusher from 'pusher-js';
import Deck from "../Components/Deck";
import HandCards from "../Components/HandCards";
import usePusher from "../hooks/usePusher";
import pusher from "pusher-js/types/src/core/pusher";


export default function GameTable() {
    interface Player {
        id: string;
        name: string;
        session_id: string;
    }
    interface Game {
        id: string;
        playerCount: number;
    }
    const processing = false;
    const gameId = useParams().gameId || ""; // デフォルト値として空文字列を設定
    const channel = usePusher("game." + gameId);
    const playerCount = parseInt(useParams().playerCount || "0"); // デフォルト値として "0" を設定
    const [sessionId, setSessionId] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [deck, setDeck] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [readyUpPlayers, setReadyUpPlayers] = useState<Player[]>([]);
    const [full, setFull] = useState(false);
    const navigate = useNavigate();

    const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(event.target.value);
    };


    // サーバーから現在のプレイヤーのリストを取得
    const fetchPlayersReady = async () => {
        try {
            const response = await axios.get(`/api/game/${gameId}/players`);
            setReadyUpPlayers(response.data.players);
        } catch (error) {
            console.error(error);
        }
    };

    // // コンポーネントがマウントされた時にローカルストレージからsessionIdを読み込む
    // useEffect(() => {
    //     const storedSessionId = localStorage.getItem("sessionId");
    //     if (storedSessionId) {
    //         setSessionId(storedSessionId);
    //     }
    // }, []);

    // // sessionIdが更新された時にローカルストレージに保存する
    // useEffect(() => {
    //     if (sessionId) {
    //         localStorage.setItem("sessionId", sessionId);
    //     }
    // }, [sessionId]);

    useEffect(() => {
        if (channel) {
            channel.unbind_all();
            channel.unsubscribe();
        }
        return () => {
            if (channel) {
                channel.unbind_all();
                channel.unsubscribe();
            }
        };
    }, [gameId]); // gameIdが変更されたときのみこのEffectを実行

    useEffect(() => {
        if (channel) {
            channel.bind('player-state', (data: any) => {
                console.log('Player ready event received:', data);
            setReadyUpPlayers(prevPlayers => [...prevPlayers, data.player]);
            });
            channel.bind('game-started', (data: any) => {
                navigate('/gamePlay/' + gameId);
            });
        }

        return () => {
            if (channel) {
                channel.unbind('player-state');
            }
        };
    }, [channel]);

    useEffect(() => {
        console.log("readyUpPlayers", readyUpPlayers);
    }, [readyUpPlayers]);

    const readyUpPlayersList = readyUpPlayers.map((player) => (
        <li key={player.id}>
            {" "}
            {player.session_id === sessionId
                ? `${player.name}（あなた）`
                : player.name}{" "}
            が準備完了しました。
        </li>
    ));

    const handleReadyUp = async () => {
        try {
            const response = await axios.post(
                "/api/player/ready",
                {
                    name: playerName,
                    gameId: gameId,
                },
                {
                    headers: {
                        "X-Session-ID": sessionId,
                    },
                }
            );

            // 自分自身をローカルの準備完了プレイヤーリストに追加
            setReadyUpPlayers(prevPlayers => [...prevPlayers, {
                id: response.data.player.id,
                name: response.data.player.name,
                session_id: response.data.player.session_id
            }]);

            setSessionId(response.data.player.session_id);
            sessionStorage.setItem(
                "sessionId",
                response.data.player.session_id
            );
            setFull(response.data.full);
            setIsReady(true);
            fetchPlayersReady();

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // コンポーネントのマウント時にプレイヤーのリストを取得
        fetchPlayersReady();
    }, []);

    useEffect(() => {
        if (readyUpPlayers.length === playerCount) {
            setFull(true);
        }
    }, [readyUpPlayers, playerCount]);

    const handleStartGame = async () => {
    try {
        await axios.post(`/api/game/${gameId}/start`);
        navigate('/gamePlay/' + gameId);
    } catch (error) {
        console.error('ゲーム開始エラー:', error);
    }
};

    return (
        <div className="flex flex-col items-center justify-center">
            {isReady === false && (
                <div>
                    {readyUpPlayers.length < playerCount ? (
                        <div>
                            <input
                                type="text"
                                placeholder="名前を入力してください"
                                value={playerName}
                                onChange={handlePlayerNameChange}
                                className="m-2"
                            />
                            <button onClick={handleReadyUp} className="m-2">
                                準備完了
                            </button>
                        </div>
                    ) : (
                        <p className="text-red-500">満席です</p>
                    )}
                </div>
            )}
            <ul className="list-none p-0">{readyUpPlayersList}</ul>
            {readyUpPlayers.length === playerCount &&
            <button onClick={handleStartGame} className="m-2 bg-blue-200 text-white font-bold py-2 px-4 rounded">
                ゲーム開始
            </button>
            }
        </div>
    )
}
