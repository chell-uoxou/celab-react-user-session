import { useState } from "react";

type CounterProps = {
    defaultValue?: number;
    step?: number;
    label?: string;
};
function Counter(props: CounterProps) {
    const [countState, setCountState] = useState(props.defaultValue ?? 5);

    const handleClickFuyasu = () => {
        setCountState(countState + (props.step ?? 1));
    };
    const handleClickHerasu = () => {
        setCountState(countState - (props.step ?? 1));
    };
    return (
        <div>
            <p>{props.label ?? '状態のカウント'}: {countState}</p>
            <button onClick={handleClickFuyasu}>増やす</button>
            <button onClick={handleClickHerasu}>減らす</button>
        </div>

    );

}

export default Counter;