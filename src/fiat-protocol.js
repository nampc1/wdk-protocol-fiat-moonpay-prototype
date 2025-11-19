/** @typedef {'in_progress' | 'failed' | 'completed'} WdkRampTransactionStatus */

/**
 * @typedef {object} WdkRampTransactionDetail
 * @property {WdkRampTransactionStatus} status
 * @property {number} feeAmount
 * @property {string} cryptoAsset
 * @property {string} fiatCurrency
 * @property {object} [metadata]
 */

/** @interface */
export class IFiatProtocol {
  /**
   * 
   * @param {string} cryptoAsset 
   * @param {string} fiatCurrency 
   * @param {number | bigint} amount 
   * @param {string} [recipient]
   * @param {object} [config] 
   * @returns {Promise<string>} The URL to redirect user to
   */
  async buy(cryptoAsset, fiatCurrency, amount, recipient, config) {
    throw new Error('Not implemented')
  }

  /**
   * 
   * @param {string} cryptoAsset 
   * @param {string} fiatCurrency 
   * @param {number | bigint} amount 
   * @param {string} refundAddress 
   * @param {object} config 
   * @returns {Promise<string>} The URL to redirect user to
   */
  async sell(cryptoAsset, fiatCurrency, amount, refundAddress, config) {
    throw new Error('Not implemented')
  }

  /**
   * 
   * @param {'buy' | 'sell'} direction 
   * @param {string} txId 
   * @returns {Promise<WdkRampTransactionDetail>} Detail of transaction
   */
  async getTransactionDetail(direction, txId) {
    throw new Error('Not implemented')
  }
}

/**
 * @abstract
 * @implements {IFiatProtocol}
 */
export class FiatProtocol {
  /**
   * 
   * @param {object} [account] 
   */
  constructor(account) {
    this._account = account
  }

  /**
   * 
   * @param {string} cryptoAsset 
   * @param {string} fiatCurrency 
   * @param {number | bigint} amount 
   * @param {string} [recipient]
   * @param {object} [config] 
   * @returns {Promise<string>} The URL to redirect user to
   */
  async buy(cryptoAsset, fiatCurrency, amount, recipient, config) {
    throw new Error('Not implemented')
  }

  /**
   * 
   * @param {string} cryptoAsset
   * @param {string} fiatCurrency 
   * @param {number | bigint} amount 
   * @param {string} refundAddress 
   * @param {object} config 
   * @returns {Promise<string>} The URL to redirect user to
   */
  async sell(cryptoAsset, fiatCurrency, amount, refundAddress, config) {
    throw new Error('Not implemented')
  }

  /**
   * 
   * @param {'buy' | 'sell'} direction 
   * @param {string} txId 
   * @returns {Promise<WdkRampTransactionDetail>} Detail of transaction
   */
  async getTransactionDetail(direction, txId) {
    throw new Error('Not implemented')
  }
}