import React, { useState } from "react";
import "./css/hud.scss";
import Player from "./models.js";
import PropTypes from "prop-types";

export default function Hud(props) {
    const [player, can_call, can_raise, can_check] = [
        props.player,
        props.player.can_call,
        props.player.can_raise,
        props.player.can_check,
    ];

    const [bet, setBet] = useState(0);
    const [showInput, setShowInput] = useState(false);
    let current_bet = props.current_bet;

    const handleBet = (e) => {
        props.on_bet(e);
    };
    console.log(props.current_bet);
    return (
        <div className="hud">
            <div className="bets">
                <h1>{player.name}</h1>
                <div className="bet-buttons">
                    {can_call && (
                        <button
                            onClick={() => handleBet(player.bet(current_bet))}
                        >
                            call
                        </button>
                    )}
                    {can_raise && (
                        <button onClick={() => setShowInput(!showInput)}>
                            Raise
                        </button>
                    )}
                    {can_check && (
                        <button onClick={() => handleBet(player.bet(0))}>
                            check
                        </button>
                    )}
                    {showInput && (
                        <div>
                            <input
                                type="number"
                                value={bet}
                                onChange={(e) => setBet(e.target.value)}
                            />
                            <button onClick={() => handleBet(player.bet(bet))}>
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
                <div className="card-container">
                    {player.hand.map((card) => {
                        return card.html_data;
                    })}
                </div>
            </div>
        </div>
    );
}

Hud.propTypes = {
    player: PropTypes.instanceOf(Player),
    current_bet: PropTypes.number.isRequired,
    on_bet: PropTypes.func.isRequired,
};
