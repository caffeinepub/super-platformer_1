import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";

actor {
  type Score = {
    playerName : Text;
    score : Int;
  };

  module Score {
    public func compare(score1 : Score, score2 : Score) : Order.Order {
      Int.compare(score2.score, score1.score);
    };
  };

  let scores = List.empty<Score>();

  public shared ({ caller }) func submitScore(playerName : Text, score : Int) : async () {
    let newScore : Score = {
      playerName;
      score;
    };
    scores.add(newScore);
  };

  public query ({ caller }) func getTopScores() : async [Score] {
    scores.values().toArray().sort().sliceToArray(0, Int.min(10, scores.size()));
  };
};
