import React, { Component } from "react";
import { new_deck } from "./models.js";
import "./css/table.scss";
import PropTypes from "prop-types";

export default function Table(props) {
    return (
        <div className={"table"}>
            <h2>table</h2>
            <p>info</p>
            <ul>
                <li>
                    c_cards:{" "}
                    {props.c_cards.map((card) => {
                        return card.html_data;
                    })}
                </li>
                <li>
                    players:{" "}
                    {props.players.map((player) => {
                        return player.html_data();
                    })}
                </li>
                <li>pot: {props.pot}</li>
                <li>
                    bets:{" "}
                    {props.bets.map((bet) => {
                        return `$${bet} `;
                    })}
                </li>
                <li>stage: {props.stage}</li>
                <li>
                    current player:{" "}
                    {props.players[props.current_player].html_data()}
                </li>
            </ul>
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
};
