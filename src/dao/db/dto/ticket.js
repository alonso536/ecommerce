class TicketDto {
    constructor(id, code, purchase_datetime, amount, purchaser, products) {
        this.id = id;
        this.code = code;
        this.purchase_datetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
        this.products = products;
    }
}

export default TicketDto;