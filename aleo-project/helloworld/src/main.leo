// The 'helloworld' program.
program helloworld.aleo {
    transition main(public a: u32, b: u32, c: u32) -> u32 {
        return new_func(a, b, c);
    }

    function new_func(a: u32, b: u32, c: u32) -> u32 {
        let d: u32 = a + b + c;
        return d;
    }
}
