import React from "react";
import Die from "./components/Die";
import "./style.css";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = React.useState(allNewDice());
    const [tenzies, setTenzies] = React.useState(false);
    const [windowSize, setWindowSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Track window resize to adjust Confetti size
    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    React.useEffect(() => {
        const allHeld = dice.every((die) => die.isHeld);
        const firstValue = dice[0].value;
        const allSameValue = dice.every((die) => die.value === firstValue);
        if (allHeld && allSameValue) {
            setTenzies(true);
            console.log("You won!");
        }
    }, [dice]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: Date.now() + Math.random(),
        };
    }

    function allNewDice() {
        return Array.from({ length: 10 }, generateNewDie);
    }

    function rollDice() {
        if (!tenzies) {
            setDice((oldDice) =>
                oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
            );
        } else {
            setTenzies(false);
            setDice(allNewDice());
        }
    }

    function holdDice(id) {
        setDice((oldDice) =>
            oldDice.map((die) =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die
            )
        );
    }

    const diceElements = dice.map((die) => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ));

    return (
        <main>
            {tenzies && (
                <Confetti width={windowSize.width} height={windowSize.height} />
            )}
            <div className="dice-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollDice}>
                {tenzies ? "New Game" : "Roll Dice"}
            </button>
        </main>
    );
}
