import React, { Component } from "react";
import "./css/screen.scss";
import Table from "./table.jsx";
import Header from "./header.jsx";
import Hud from "./hud.jsx";
import Player, { new_deck } from "./models.js";

export default class Screen extends Component {
    state = {
        players: [
            new Player("player1", 1000),
            new Player("player2", 1000),
            new Player("player3", 1000),
        ],
        current_player: 0,
        pot: 0,
        stage: "showdown",
        deck: new_deck(),
        c_cards: [],
        bets: [],
    };

    render() {
        console.log(this.state.bets);
        return (
            <div className="screen playingCards faceImages simpleCards">
                <Header />
                <Table
                    bets={this.state.bets}
                    c_cards={this.state.c_cards}
                    deck={this.state.deck}
                    players={this.state.players}
                    pot={this.state.pot}
                    stage={this.state.stage}
                    current_player={this.state.current_player}
                    on_next_player={this.next_player}
                />
                <button onClick={() => this.reset_table()}>reset</button>
                <Hud
                    player={this.state.players[this.state.current_player]}
                    on_bet={(bet) => this.add_bet(bet)}
                    current_bet={Math.max(...this.state.bets)}
                />
            </div>
        );
    }

    componentDidMount() {
        this.reset_table();
    }

    next_player = () => {
        if (this.state.current_player === this.state.players.length - 1) {
            this.setState({ current_player: 0 });
        } else {
            this.setState({ current_player: this.state.current_player + 1 });
        }

        if (this.state.current_player == 0) {
            if (
                this.state.bets.every(
                    (bet) => bet === Math.max(...this.state.bets)
                )
            ) {
                this.next_stage();
            }
        }
    };

    add_bet = (bet) => {
        this.setState({ pot: this.state.pot + Number(bet) });
        this.state.bets[this.state.current_player] = Number(bet);
        console.log(this.state.bets);
        this.next_player();
    };

    reset_table() {
        let first_player = this.state.players.shift();
        this.state.players.push(first_player);
        this.setState({
            deck: new_deck(),
            c_cards: [],
            pot: 0,
            stage: "preflop",
            bets: new Array(this.state.players.length).fill(0),
            current_player: 0,
        });
        this.state.players.forEach((player) => {
            player.get_hand(this.state.deck.splice(0, 2));
        });
    }

    next_stage() {
        switch (this.state.stage) {
            case "preflop":
                this.flop();
                break;
            case "flop":
                this.turn();
                break;
            case "turn":
                this.river();
                break;
            case "river":
                this.showdown();
                break;
            case "showdown":
                this.reset_table();
            default:
                break;
        }
        console.log(this.state.stage);
    }

    flop() {
        this.setState({
            c_cards: this.state.c_cards.concat(this.state.deck.splice(0, 3)),
            stage: "flop",
        });
    }

    turn() {
        this.setState({
            c_cards: this.state.c_cards.concat(this.state.deck.splice(0, 1)),
            stage: "turn",
        });
    }

    river() {
        this.setState({
            c_cards: this.state.c_cards.concat(this.state.deck.splice(0, 1)),
            stage: "river",
        });
    }

    showdown() {
        this.setState({
            stage: "showdown",
        });
    }
}
