import {Delegate} from "./Delegate";

export abstract class Model<State, Props, ActionType> {
    private mState: State;
    private readonly mProps: Props;
    private readonly stateHistory: {state: State, time: Date}[];
    public get state() { return this.mState; }
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
        this.stateHistory = [];
    }


    protected reducer(action: ActionType, data: any, shouldRender: boolean) {
        const newState = this.reducerImpl(action, data, this.mState);

        if (Object.is(this.mState, newState))
            return;

        // commit changes
        this.stateHistory.push({state: newState, time: new Date()});
        this.mState = newState;

        // send delegate
        this.statechange.invoke(this, shouldRender);
    }


    abstract reducerImpl(action: ActionType, data: any, lastState: State): State;


    /**
     * For debugging, logs the history of each state change.
     * @param lastN {number} log the last number of entries. Default 0, will log all.
     * When state history length is less than lastN, all entries will be logged.
     */
    public logStateHistory(lastN = 0) {
        const length = this.stateHistory.length;
        const start = lastN < 1 ? 0 : Math.max(length - lastN, 0);

        for (let i = start; i < length; ++i) {
            const info = this.stateHistory[i];
            console.log(`State #${i} | ${info.time.toLocaleTimeString()}`);
            console.dir(info.state);
        }
    }

}