import React from "react";
import "./css/table.scss";
import PropTypes from "prop-types";
import { Card } from "./models.js";

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

    const winning_hand = () => {
        let hand = props.winning_hand.split(",").map((card) => {
            console.log(card);
            if (card.length === 2) {
                return new Card(card.slice(1), card.slice(0));
            }
            return new Card(card.slice(2), card.slice(0, 1));
        });

        return (
            <span className="playingCards inText winning_hand">
                {hand.map((card) => {
                    return card.html_data;
                })}
            </span>
        );
    };

    const info = (
        <div className="info">
            stage: {props.stage}
            <div className="playingCards faceImages c_cards">
                {props.c_cards.map((card) => {
                    return card.html_data;
                })}
            </div>
            {props.stage === "showdown" && (
                <div>
                    <h1>Winner: {props.winner}</h1>
                    <h2>Result: {props.result}</h2>
                    Hand: {winning_hand()}
                    <button onClick={props.on_new_round}>next round</button>
                </div>
            )}
        </div>
    );
    return (
        <div className={"poker_table"}>
            <div className="players">
                <div className="hands">
                    {props.players.map((player) => {
                        return player.html_data();
                    })}
                </div>
                pot: {props.pot}
                bets:{" "}
                {props.bets.map((bet) => {
                    return `$${bet} `;
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
