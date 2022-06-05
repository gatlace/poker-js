const suits = ["H", "D", "S", "C"];
const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
];

export class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    get api_data() {
        return this.value+this.suit
    }

    get html_data() {
        let suit = null;

        switch(this.suit) {
            case "H":
                suit = "hearts"
                break
            case "D":
                suit = "diams"
                break
            case "C":
                suit = "clubs"
                break
            case "S":
                suit = "spades"
                break
            default:
                break
        }

        let value = this.value.toLowerCase();
        let suit_html = "&"+suit+";";

        return (<div className={"card rank-"+ value + " "+suit}>
            <span className="rank">{this.value}</span>
            <span className="suit" dangerouslySetInnerHTML={{__html: suit_html}}></span>
            </div>)
            
    }
}

export default class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.bank = 5000;
        this.folded = false;
        this.can_call = true;
        this.can_raise = true;
        this.can_check = true;

    }

    bet = (amount) => {
        this.bank -= amount;
        console.log(this.name + " bets " + amount);
        return amount;
    }

    fold = () => {
        this.folded = true;
        this.hand = [];
    }

    html_data = () => {
        return(
            <span>
            <i>{this.name}: </i>
            <i>${this.bank}</i>
            </span>
        )
    }

    get_hand = (cards) => {
        this.hand = cards;
    }
}

export function new_deck() {
    let deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            let suit = Math.floor(Math.random() * suits.length);
            let value = Math.floor(Math.random() * values.length);
            deck.push(new Card(suits[suit], values[value]));
        }
    }

    return deck;
}