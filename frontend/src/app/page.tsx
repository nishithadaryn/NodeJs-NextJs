"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BACKEND_API_BASE_URL } from "@/constants";
import { PetProjectButton } from "@/components/buttons";
import { PlayerNameInput } from "@/components/input";
import { setPlayerNameInLocalStorage } from "@/utils/localStorageUtils";

export default function Page() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

  const handleStartGame = async () => {
    if (!playerName.trim()) return; // prevent empty names

    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: playerName }),
      });

      if (!response.ok) throw new Error("Failed to start game");

      const data = await response.json();

      // Store locally
      setPlayerNameInLocalStorage(data.id, playerName);

      // Navigate to game page
      router.push(`/games/${data.id}`);
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <h2 className="text-center mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-600 dark:text-slate-200">
        New Game
      </h2>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <PlayerNameInput
          label="Your name"
          value={playerName}
          setValue={setPlayerName}
        />

        <PetProjectButton
          label="Start Game"
          onClickHandler={handleStartGame}
        />
      </div>
    </div>
  );
}
