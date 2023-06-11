
export abstract class View<P, S, ActionType> {
    private readonly mProps: P;
    private mState: S;
    private mReducerImpl: ((actionType: ActionType, data: any, lastState: S) => S) | null;
    private readonly mStateHistory: {state: S, time: Date}[];

    protected constructor(props: P, defaultState: S) {
        this.mProps = props;
        this.mState = defaultState;
        this.mReducerImpl = null;
        this.mStateHistory = [{state: defaultState, time: new Date()}];
    }

    // Render to the DOM
    public abstract render();

    // intended to be readonly
    public get props(): P {
        return this.mProps;
    }

    // intended to be readonly
    public get state(): S {
        return this.mState;
    }

    /**
     * Call the reducer set from `setReducer`
     */
    protected reducer(actionType: ActionType, data: any) {
        if (!this.mReducerImpl)
            throw "Attempted to call View.prototype.reducer without first setting it. " +
                "Please set it via View.prototype.setReducer before calling it.";

        const newState = this.mReducerImpl(actionType, data, this.mState);

        if (Object.is(this.mState, newState)) // don't update if reducer returned lastState
            return;

        this.mState = newState;
        this.mStateHistory.push({state: newState, time: new Date()});
        this.render();
    }

    /**
     * Set the reducer for this view.
     * @param reducer Callback when View.prototype.reducer is called. If you simply return lastState, nothing will happen.
     * This is appropriate when the reducer was called but there is no need to update the DOM, for optimization.
     * Returning a new state will result in a change. Please make sure all inner data is deep copied as well.
     */
        public setReducer(reducer: (actionType: ActionType, data: any, lastState: S) => S) {
            this.mReducerImpl = reducer;
        }


    /**
     * For debugging, logs the history of each state change.
     * @param lastN {number} log the last number of entries. Default 0, will log all.
     * When state history length is less than lastN, all entries will be logged.
     */
    public logStateHistory(lastN = 0) {
        const length = this.mStateHistory.length;
        const start = lastN < 1 ? 0 : Math.max(length - lastN, 0);

        for (let i = start; i < length; ++i) {
            const info = this.mStateHistory[i];
            console.log(`State #${i} | ${info.time.toLocaleTimeString()}`);
            console.dir(info.state);
        }
    }
}

