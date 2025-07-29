import { useState } from "react";

function Counter() {
    const [countState, setCountState] = useState(5);


    const handleClickFuyasu = () => {
        setCountState(countState + 1);
    };
    const handleClickHerasu = () => {
        setCountState(countState - 1);
    };
    return (
        <div>
            <p>count: {countState}</p>
            <button onClick={handleClickFuyasu}>増やす</button>
            <button onClick={handleClickHerasu}>減らす</button>
        </div>

    );

}

export default Counter;