import CreateGame from "../Components/CreateGame";
import JoinGame from "../Components/JoinGame";
import React from "react";

const SettingGame = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-center">Septet Symphony</h1>
                <div className="mt-4">
                    <CreateGame />
                    <JoinGame />
                </div>
            </div>
        </>
    );
};

export default SettingGame;
