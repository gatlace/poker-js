import React, { useState } from "react";
import "./css/hud.scss";
import Player from "./models.js";
import PropTypes from "prop-types";

export default function Hud(props) {
    const player = props.player;
    const current_bet = props.current_bet;

    let [can_call, can_raise, can_check] = [
        player.bank >= current_bet,
        player.bank > current_bet,
        current_bet === 0,
    ];

    const [bet, setBet] = useState(0);
    const [showInput, setShowInput] = useState(false);

    const handle_bet = (bet) => {
        if (bet > player.chips) {
            alert("You don't have enough chips");
            return;
        }

        if (bet < current_bet) {
            alert(`You must bet at least $${current_bet}`);
            return;
        }

        props.on_bet(Number(bet));
    };

    return (
        <div className="hud">
            <div className="bets">
                <h1>{player.name}</h1>
                <div className="bet-buttons">
                    {can_call && (
                        <button
                            onClick={() => {
                                props.stage !== "showdown" &&
                                    handle_bet(current_bet);
                            }}
                        >
                            call
                        </button>
                    )}
                    {can_raise && (
                        <button
                            onClick={() => {
                                props.stage !== "showdown" &&
                                    setShowInput(!showInput);
                            }}
                        >
                            Raise
                        </button>
                    )}
                    {can_check && (
                        <button
                            onClick={() => {
                                props.stage !== "showdown" && handle_bet(0);
                            }}
                        >
                            check
                        </button>
                    )}
                    {props.stage !== "showdown" && showInput && (
                        <div>
                            <input
                                type="number"
                                value={bet}
                                onChange={(e) => setBet(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    setShowInput(!showInput);
                                    handle_bet(bet);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
                <h2>Bank: ${player.bank}</h2>
                <p>Current Bet: ${current_bet}</p>
            </div>
            <div className="cards">
                <h1>Cards</h1>
                <div className="playingCards faceImages">
                    {player.hand.map((card) => {
                        return card.html_data;
                    })}
                </div>
            </div>
        </div>
    );
}

Hud.propTypes = {
    current_player: PropTypes.number.isRequired,
    stage: PropTypes.string.isRequired,
    player: PropTypes.instanceOf(Player),
    current_bet: PropTypes.number.isRequired,
    on_bet: PropTypes.func.isRequired,
};
