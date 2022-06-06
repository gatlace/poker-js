import "./css/screen.scss";
import Table from "./table.jsx";
import Header from "./header.jsx";
import Hud from "./hud.jsx";
import Player, { new_deck } from "./models.js";

import React, { useState } from "react";

export default function Screen() {
    let [deck, setDeck] = useState(new_deck());
    let [players, setPlayers] = useState([
        new Player("Player 1", 1000),
        new Player("Player 2", 1000),
        new Player("Player 3", 1000),
    ]);
    const [current_player, setCurrentPlayer] = useState(0);
    const [pot, setPot] = useState(0);
    const [stage, setStage] = useState("none");
    const [c_cards, setCards] = useState([]);
    const [winner, setWinner] = useState("");
    const [winning_hand, setWinningHand] = useState("");
    const [result, setResult] = useState("");

    let bets = () => {
        let bets = [];
        players.forEach((player) => {
            bets.push(player.bet);
        });

        if (stage === "preflop") {
            if (current_player === 0) {
                bets[0] = 50;
            }
            if (current_player === 1) {
                bets[1] = 100;
            }
        }

        return bets;
    };

    let check_bets = () => {
        let url = "http://api.pokerapi.dev/v1/winner/texas_holdem?";
        let cc = "cc=" + c_cards.map((card) => card.api_data).join(",");
        let pc =
            "&pc[]=" +
            players
                .map((player) =>
                    player.hand.map((card) => card.api_data).join(",")
                )
                .join("&pc[]=");
        console.log(url + cc + pc);
        return url + cc + pc;
    };

    const handle_bet = (bet) => {
        players[current_player].add_bet(bet);
        setPot(pot + bet);
        next_player();
    };

    const next_player = () => {
        if (current_player === players.length - 1) {
            setCurrentPlayer(0);
            next_stage();
        } else {
            setCurrentPlayer(current_player + 1);
        }
    };

    const on_play = () => {
        reset_table();
    };

    const next_stage = () => {
        setPlayers(
            players.map((player) => {
                player.bet = 0;
                return player;
            })
        );
        console.log(stage);
        switch (stage) {
            case "preflop":
                flop();
                break;
            case "flop":
                turn();
                break;
            case "turn":
                river();
                break;
            case "river":
                showdown();
                break;
            case "showdown":
                reset_table();
                break;
            default:
                break;
        }
    };

    const deal_cards = () => {
        var temp_deck = new_deck();

        setPlayers(
            players.map((player) => {
                player.bet = 0;
                player.get_hand(temp_deck.splice(0, 2));
                return player;
            })
        );

        setDeck(temp_deck);
    };

    const flop = () => {
        setStage("flop");
        setCards(c_cards.concat(deck.splice(0, 3)));
        console.log(deck.length);
    };

    const turn = () => {
        setStage("turn");
        setCards(c_cards.concat(deck.splice(0, 1)));
        console.log(deck.length);
    };

    const river = () => {
        setStage("river");
        setCards(c_cards.concat(deck.splice(0, 1)));
        console.log(deck.length);
    };

    const showdown = async () => {
        setStage("showdown");

        let result = await fetch(check_bets()).then((res) => res.json());

        setWinner(
            players.find(
                (player) =>
                    player.hand.map((card) => card.api_data).join(",") ===
                    result.winners[0].cards
            )
        );
        setWinningHand(result.winners[0].hand);

        setResult(result.winners[0].result);
    };

    const reset_table = () => {
        setCards([]);
        setStage("preflop");
        setPot(0);
        setCurrentPlayer(0);
        setWinner("");
        setWinningHand("");
        setResult("");
        deal_cards();
        console.log(deck.length);
    };

    const handle_winner = () => {
        winner.bank += pot;
        reset_table();
    };

    const reset_players = () => {
        setPlayers(
            players.map((player) => {
                player.bet = 0;
                player.bank = 5000;
                return player;
            })
        );
    };

    return (
        <div className="screen">
            <Header />
            <Table
                bets={bets()}
                c_cards={c_cards}
                deck={deck}
                players={players}
                pot={pot}
                stage={stage}
                current_player={current_player}
                on_play={on_play}
                on_new_round={handle_winner}
                winner={winner.name}
                winning_hand={winning_hand}
                result={result}
            />
            <button
                onClick={() => {
                    reset_table();
                    reset_players();
                }}
            >
                reset everything
            </button>
            <Hud
                stage={stage}
                player={players[current_player]}
                current_player={current_player}
                current_bet={Math.max(...bets())}
                on_bet={handle_bet}
            />
        </div>
    );
}
