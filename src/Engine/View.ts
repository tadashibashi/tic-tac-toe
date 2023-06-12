import { Model } from "./Model";

export abstract class View<M extends Model<any, any, any>> {
    private model: M;

    protected constructor(model: M) {
        this.model = model;
        model.statechange.addListener(this.render, this);
        this.render(model, true);
    }

    // Render to the DOM
    private render(model: M, shouldRender: boolean) {
        if (!shouldRender) return;

        this.renderImpl(model);
    }

    public abstract renderImpl(model: M);

    close() {
        this.model.statechange.removeListener(this.render, this);
    }

}

