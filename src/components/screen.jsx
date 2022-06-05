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
        deck: [],
        c_cards: [],
    };

    bets = () => {
        let bets = [];
        this.state.players.forEach((player) => {
            bets.push(player.bet);
        });
        return bets;
    };

    render() {
        return (
            <div className="screen playingCards faceImages simpleCards">
                <Header />
                <Table
                    bets={this.bets()}
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
                    current_bet={Math.max(...this.bets())}
                    on_bet={this.handle_bet}
                />
            </div>
        );
    }

    componentDidMount() {
        this.reset_table();
    }

    handle_bet = (bet) => {
        this.state.players[this.state.current_player].add_bet(bet);
        this.setState({ pot: this.state.pot + bet });
        this.next_player();
    };

    next_player = () => {
        if (this.state.current_player === this.state.players.length - 1) {
            this.setState({ current_player: 0 });
        } else {
            this.setState({ current_player: this.state.current_player + 1 });
        }

        if (this.state.current_player === 0) {
            if (this.bets().every((bet) => bet === Math.max(...this.bets()))) {
                this.next_stage();
            }
        }
    };

    reset_table() {
        let first_player = this.state.players.shift();
        this.state.players.push(first_player);
        this.setState({
            deck: new_deck(),
            c_cards: [],
            pot: 0,
            stage: "preflop",
            current_player: 0,
            bets: [],
        });
        this.state.players.forEach((player) => {
            player.bet = 0;
            player.get_hand(this.state.deck.splice(0, 2));
        });
    }

    check_bets() {
        let url = "http://api.pokerapi.dev/v1/winner/texas_holdem?";
        let cc =
            "cc=" + this.state.c_cards.map((card) => card.api_data).join(",");
        let pc =
            "&pc[]=" +
            this.state.players
                .map((player) =>
                    player.hand.map((card) => card.api_data).join(",")
                )
                .join("&pc[]=");
        return url + cc + pc;
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

        fetch(this.check_bets())
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    }
}
