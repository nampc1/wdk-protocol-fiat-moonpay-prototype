/** @typedef {'in_progress' | 'failed' | 'completed'} WdkRampTransactionStatus */

/**
 * @typedef {object} WdkRampTransactionDetail
 * @property {WdkRampTransactionStatus} status
 * @property {number} feeAmount
 * @property {string} cryptoAsset
 * @property {string} fiatCurrency
 * @property {object} [metadata]
 */

/**
 * A standardized object representing a supported cryptocurrency.
 * @typedef {object} WdkFiatSupportedAsset
 * @property {string} code
 * @property {string} networkCode - The network code for the asset, if applicable (e.g., 'ethereum', 'tron').
 * @property {number} precision - The number of decimal places for the asset.
 * @property {string} [name] - The asset's full name (e.g., 'Bitcoin').
 * @property {object} [metadata] - Provider-specific raw data for this asset.
 */

/**
 * A standardized object representing a supported fiat currency.
 * @typedef {object} WdkFiatSupportedCurrency
 * @property {string} code - The currency's ISO 4217 code (e.g., 'USD').
 * @property {number} precision - The number of decimal places for the currency.
 * @property {string} [name] - The currency's full name (e.g., 'United States Dollar').
 * @property {object} [metadata] - Provider-specific raw data for this currency.
 */

/**
 * A standardized object representing a supported region or country.
 * @typedef {object} WdkFiatSupportedRegion
 * @property {string} code - The country's ISO 3166-1 alpha-2 code.
 * @property {boolean} isBuyAllowed - Whether buying is supported in this region.
 * @property {boolean} isSellAllowed - Whether selling is supported in this region.
 * @property {string} [name] - The country's common name.
 * @property {object} [metadata] - Provider-specific raw data for this region.
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

  /**
   * @returns {Promise<WdkFiatSupportedAsset[]>}
   */
  async getSupportedCryptoAssets() {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<WdkFiatSupportedCurrency[]>}
   */
  async getSupportedFiatCurrencies() {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<WdkFiatSupportedRegion[]>}
   */
  async getSupportedRegions() {
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

  /**
   * @returns {Promise<WdkFiatSupportedAsset[]>}
   */
  async getSupportedCryptoAssets() {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<WdkFiatSupportedCurrency[]>}
   */
  async getSupportedFiatCurrencies() {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<WdkFiatSupportedRegion[]>}
   */
  async getSupportedRegions() {
    throw new Error('Not implemented')
  }
}