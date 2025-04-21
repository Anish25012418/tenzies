import Die from "./components/Die.jsx";
import {useRef, useState, useEffect} from "react";
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const generateAllNewDice = () => {
        return new Array(10).fill(0).map(() => ({value: Math.ceil(Math.random() * 9), isHeld: false, id: nanoid()}))
    }
    const [dice, setDice] = useState(() => generateAllNewDice());
    const buttonRef = useRef(null);
    const [count, setCount] = useState(0);
    const gameWon = dice.every((die) => die.isHeld) && dice.every((die) => die.value === dice[0].value);
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus();
        }
    }, [gameWon])
    const rollDice = () => {
        if (gameWon) {
            setDice(generateAllNewDice)
            setCount(0)
        } else {
            setDice(prevState => prevState.map(die => die.isHeld ? die : {
                ...die,
                value: Math.ceil(Math.random() * 9)
            }));
            setCount(prevState => prevState + 1);
        }

    }
    const hold = (id) => {
        setDice(prevState => prevState.map(die => die.id === id ? {...die, isHeld: !die.isHeld} : die));
    }
    const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld}
                                              hold={() => hold(die.id)}/>)

    return (
        <main>
            {gameWon && <Confetti/>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each dice to freeze it at its current
                value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <p className="rolls">Rolls: {count}</p>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>{gameWon ? "New Game" : "Roll"}</button>
        </main>
    )
}