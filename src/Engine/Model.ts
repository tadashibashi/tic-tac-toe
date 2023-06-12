import { Delegate } from "./Delegate";

const DEBUG_MODE = true; // when set to true, saves state
const DEBUG_AUTOLOG = true; // auto logs state when it changes. DEBUG_MODE must be true.

interface StateInfo<T> {
    state: T;
    time: Date;
}

export abstract class Model<State, Props, ActionType> {
    private mState: State;
    private readonly mProps: Props;
    private readonly stateHistory: StateInfo<State>[];

    /**
     * Current state data. Read-only, please don't modify directly.
     */
    public get state() { return this.mState; }

    /**
     * Props data. Usually contains cached refs.
     * Read-only, please don't modify directly.
     */
    public get props() { return this.mProps; }


    /**
     * # statechange
     * ## params:
     *   - `newState` the updated state
     *   - `lastState` the last state
     *   - `shouldRender` if the statechange should cause an update to rendering
     * definition: (newState: State, lastState: State, shouldRender: boolean) => void
     */
    public readonly statechange: Delegate<[Model<State, Props, ActionType>, boolean]>;


    protected constructor(defaultState: State, props: Props) {
        this.mState = defaultState;
        this.mProps = props;
        this.statechange = new Delegate();

        if (DEBUG_MODE)
            this.stateHistory = [];
    }


    protected reducer(action: ActionType, data: any, shouldRender: boolean) {
        const newState = this.reducerImpl(action, data, this.mState);

        if (Object.is(this.mState, newState)) // state did not change, returned lastState
            return;

        if (DEBUG_MODE) {          // store state history
            const stateInfo = {state: newState, time: new Date()};
            if (DEBUG_AUTOLOG) {   // auto log when state changes
                this.logState(stateInfo, this.stateHistory.length);
            }

            this.stateHistory.push(stateInfo);
        }

        // commit changes
        this.mState = newState;
        this.statechange.invoke(this, shouldRender);
    }


    /**
     * Callback to be overriden. Update state based on action type.
     * Return a new state object to alter state. Returning lastState object
     * will cancel any effect.
     */
    protected abstract reducerImpl(action: ActionType, data: any, lastState: State): State;


    /**
     * For debugging, logs the history of each state change.
     * @param lastN {number} log the last number of entries. Default 0, will log all.
     * When state history length is less than lastN, all entries will be logged.
     */
    public logStateHistory(lastN = 0) {
        if (!DEBUG_MODE) return;

        const length = this.stateHistory.length;
        const start = lastN < 1 ? 0 : Math.max(length - lastN, 0);

        for (let i = start; i < length; ++i)
            this.logState(this.stateHistory[i], i);
    }

    private logState(info: StateInfo<State>, stateNum: number) {
        console.log(`State #${stateNum} | ${info.time.toLocaleTimeString()}`);
        console.dir(info.state);
    }
}