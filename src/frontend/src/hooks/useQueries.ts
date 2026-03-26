import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface ScoreEntry {
  playerName: string;
  score: bigint;
}

export function useGetTopScores() {
  const { actor, isFetching } = useActor();
  return useQuery<ScoreEntry[]>({
    queryKey: ["topScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerName,
      score,
    }: { playerName: string; score: bigint }) => {
      if (!actor) throw new Error("No actor available");
      await actor.submitScore(playerName, score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topScores"] });
    },
  });
}
