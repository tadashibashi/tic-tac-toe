import { Delegate} from "../src/Engine/Delegate";

test("Delegate length", () => {
    const delegate = new Delegate<[number, string]>();

    expect(delegate.length).toBe(0);
});

test("Delegate addListener 1 no context", () => {
   const delegate = new Delegate<[number, string]>();
   delegate.addListener(() => {});

   expect(delegate.length).toBe(1);
});

test("Delegate addListener 3 no context", () => {
    const delegate = new Delegate<[number, string]>();
    delegate.addListener(() => {});
    delegate.addListener(() => {});
    delegate.addListener(() => {});

    expect(delegate.length).toBe(3);
});

test("Delegate removeListener no context", () => {
    const delegate = new Delegate<[number, string]>();

    const fn1 = (a: number, b: string) => {};
    const fn2 = (a: number, b: string) => {};
    const fn3 = (a: number, b: string) => {};

    delegate.addListener(fn1);
    delegate.addListener(fn2);
    delegate.addListener(fn3);

    delegate.removeListener(fn1);

    expect(delegate.length).toBe(2);


});

class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    setName(name: string) {
        this.name = name;
    }

    setAge(age: number) {
        this.age = age;
    }
}

test("Delegate invoke without context w/ arrow function", () => {
    const delegate = new Delegate<[string]>();

    let name = "Bob";
    delegate.addListener((str) => {
        name = str;
    });

    delegate.invoke("Joe");

    expect(name).toBe("Joe");
});

test("Delegate addListener & removeListener w/ context", () => {
   const delegate = new Delegate<[string]>();

   const person = new Person("Bob", 40);

   delegate.addListener(person.setName, person);
   delegate.invoke("Joe");

   expect(person.name).toBe("Joe");

   delegate.removeListener(person.setName, person);

   expect(delegate.length).toBe(0);

});
