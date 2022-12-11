module flashLoan::test {

    use sui::transfer;


    struct FlashLender has key {
        boolean: bool,
        number: u64
    }

    // init Flash
    fun init( ctx: &mut TxContext) {
        let flash_lender = FlashLender { true, 78};
        transfer::share_object(flash_lender);
    }
}