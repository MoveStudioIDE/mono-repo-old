module demoPackage::party {
    
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;


    struct Balloon has key {
        id: UID,
        popped: bool
    }

    fun init(ctx: &mut TxContext) {
        new_balloon(ctx);
    }

    public entry fun pop_balloon(balloon: &mut Balloon) {
        balloon.popped = true;
    }

    public entry fun fill_up_balloon(ctx: &mut TxContext) {
        new_balloon(ctx);
    }

    fun new_balloon(ctx: &mut TxContext) {
        let balloon = Balloon{
            id: object::new(ctx), 
            popped: false
        };
        transfer::share_object(balloon);
    }

}