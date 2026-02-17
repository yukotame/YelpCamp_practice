export default class ExpressError extends Error{

    constructor(message, statusCode) {
        super(); // 親クラスのコンストラクタを呼び出す
        this.msg = message;
        this.status = statusCode;

    }
}