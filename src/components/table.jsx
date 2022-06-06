import React from "react";
import "./css/table.scss";
import PropTypes from "prop-types";

export default function Table(props) {
    if (props.stage === "none") {
        return (
            <div className="poker_table">
                <button className={"play"} onClick={props.on_play}>
                    Play
                </button>
            </div>
        );
    }

    const info = (
        <div className="info">
            pot: {props.pot}
            bets:{" "}
            {props.bets.map((bet) => {
                return `$${bet} `;
            })}
            stage: {props.stage}
            <div className="c_cards">
                {props.c_cards.map((card) => {
                    return card.html_data;
                })}
            </div>
            {props.stage === "showdown" && (
                <div>
                    <h1>Winner: {props.winner}</h1>
                    <h2>Result: {props.result}</h2>
                    <h3>Hand: {props.winning_hand}</h3>
                    <button onClick={props.on_play}>reset round</button>
                </div>
            )}
        </div>
    );
    return (
        <div className={"poker_table"}>
            <div className="players">
                {props.players.map((player) => {
                    return player.html_data();
                })}
            </div>
            {info}
        </div>
    );
}

Table.propTypes = {
    c_cards: PropTypes.array.isRequired,
    deck: PropTypes.array.isRequired,
    players: PropTypes.array.isRequired,
    pot: PropTypes.number.isRequired,
    stage: PropTypes.string.isRequired,
    current_player: PropTypes.number.isRequired,
    bets: PropTypes.array.isRequired,
    on_play: PropTypes.func.isRequired,
    winner: PropTypes.string.isRequired,
    winning_hand: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
};
