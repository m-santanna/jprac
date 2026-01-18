"use client";

import LoadingView from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRealtime } from "@/lib/realtime-client";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { toast } from "sonner";

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const lobbyId = params.lobbyId as string;
  const [enabled, setEnabled] = useState(false);

  const joinLobbyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http:localhost:3000/api/join-lobby", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ lobbyId })
      })
      if (!response.ok) {
        throw new Error("erro")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Successfully joined lobby!");
      setEnabled(true);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      router.push("/");
    },
  });

  useEffect(() => {
    joinLobbyMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { status } = useRealtime({
    enabled,
    events: [],
    channels: [lobbyId],
    onData: ({ event, data }) => {
      console.log(event);
      console.log(data);
    },
  });

  if (joinLobbyMutation.isPending) {
    return <LoadingView />;
  }

  if (joinLobbyMutation.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Failed to join lobby
          </h1>
          <p className="mt-2 text-gray-600">
            {joinLobbyMutation.error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Lobby: {lobbyId}</h1>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status:</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${status === "connected"
                  ? "bg-green-100 text-green-700"
                  : status === "connecting"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Lobby Information</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Waiting for other players to join...
          </p>
        </div>
      </div>
    </div>
  );
}
