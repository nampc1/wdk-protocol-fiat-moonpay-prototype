import { FiatProtocol } from "./fiat-protocol.js";
import { Buffer } from 'buffer'

const SARDINE_PORTAL = 'https://crypto.sardine.ai'
const SARDINE_SANDBOX_PORTAL = 'https://crypto.sandbox.sardine.ai'

const SARDINE_SANDBOX_API = 'https://api.sandbox.sardine.ai'
const SARDINE_API = 'https://api.sardine.ai'

/**
 * @typedef {object} SardineBuyParams
 * @property {string} network
 * @property {Array<{token: string, network: string}} supportedTokens
 */

/**
 * @typedef {object} SardineSellParams
 * @property {string} network
 */

/**
 * @typedef {object} SardinePayment
 * @property {number} amountCents
 * @property {string} currency
 * @property {string} paymentMethodId
 * @property {string} paymentMethodType
 */

/**
 * @typedef {object} SardineWithdrawalDetail
 * @property {string} walletAddress
 * @property {number} holdAmount
 * @property {string} holdUntil
 * @property {number} quantity
 * @property {boolean} isHold
 * @property {string} status
 * @property {string} txHash
 * @property {string} withdrawnAt
 */

/**
 * @typedef {object} SardineTransactionDetail
 * @property {string} id
 * @property {string} createdAt
 * @property {string} confirmedAt
 * @property {string} referenceId
 * @property {string} status
 * @property {string} fiatCurrency
 * @property {string} transactionId
 * @property {string} walletAddress
 * @property {string} expiresAt
 * @property {string} userId
 * @property {number} total
 * @property {number} subtotal
 * @property {object} processingFees
 * @property {number} processingFees.transactionFee
 * @property {number} processingFees.networkFee
 * @property {SardinePayment} payment
 * @property {object} withdrawal
 * @property {string} withdrawal.txHash
 * @property {string} withdrawal.walletAddress
 * @property {number} withdrawal.quantity
 * @property {SardineWithdrawalDetail[]} withdrawals
 */


export class SardineProtocol extends FiatProtocol {
  /**
   * @param {object} config - Configuration for the MoonPay handler.
   * @param {string} config.clientSecret - Your secret key.
   * @param {string} config.clientId - Your client ID.
   * @param {'sandbox' | 'production'} [config.env] - sandbox or production
   */
  constructor({ clientId, clientSecret, env = 'production' }) {
    super()
    this._clientId = clientId
    this._clientSecret = clientSecret
    this._api = env === 'sandbox' ? SARDINE_SANDBOX_API : SARDINE_API
    this._portal = env === 'sandbox' ? SARDINE_SANDBOX_PORTAL : SARDINE_PORTAL
  }

  async _getClientToken() {
    const url = new URL('v1/auth/client-tokens', this._api)

    const credential = Buffer.from(`${this._clientId}:${this._clientSecret}`).toString('base64')

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credential}`,
        'Accept': 'application/json'
      }
    })

    if (!resp.ok) {
      const errorBody = await resp.text()
      throw new Error(
        `Error getting client token: ${resp.status} ${resp.statusText} - ${errorBody}`
      )
    }

    const { clientToken, expiresAt } = await resp.json()

    if (!clientToken || !expiresAt) {
      throw new Error('Invalid response from token endpoint')
    }

    return { clientToken, expiresAt }
  }

  /**
   * Generates a signed MoonPay URL for a buy transaction.
   * @param {string} cryptoAsset The code of the cryptocurrency to purchase (e.g., 'btc').
   * @param {string} fiatCurrency The code of the fiat currency to purchase with (e.g., 'usd').
   * @param {number} amount The amount of fiat currency to spend.
   * @param {string} [recipient] Receiving address to receive cryptocurrency
   * @param {SardineBuyParams} [config] - Optional additional parameters for the MoonPay widget.
   * @returns {Promise<string>} A promise that resolves to the signed MoonPay URL.
   */
  async buy(cryptoAsset, fiatCurrency, amount, recipient = undefined, config = {}) {
    const url = new URL('buy', this._portal)
    const { clientToken } = await this._getClientToken()

    url.searchParams.append('client_token', clientToken)
    url.searchParams.append('asset_type', cryptoAsset)
    url.searchParams.append('fiat_currency', fiatCurrency)
    url.searchParams.append('fiat_amount', amount.toString())

    if (recipient) url.searchParams.append('address', recipient)
    if (config.network) url.searchParams.append('network', config.network)
    if (config.supportedTokens) url.searchParams.append('supported_tokens', JSON.stringify(config.supportedTokens))

    return url.toString()
  }

  /**
   * Generates a signed MoonPay URL for a sell transaction.
   * @param {string} cryptoAsset The code of the cryptocurrency to sell (e.g., 'btc').
   * @param {string} fiatCurrency The code of the fiat currency to receive (e.g., 'usd').
   * @param {number} amount The amount of cryptocurrency to sell.
   * @param {string} [refundAddress] - The cryptocurrency wallet address for refunds in case of failure.
   * @param {SardineSellParams} [config] - Optional additional parameters for the MoonPay widget.
   * @returns {Promise<string>} A promise that resolves to the signed MoonPay URL.
   */
  async sell(cryptoAsset, fiatCurrency, amount, refundAddress = undefined, config = {}) {
    const url = new URL('sell', this._portal)
    const { clientToken } = await this._getClientToken()

    url.searchParams.append('client_token', clientToken)
    url.searchParams.append('asset_type', cryptoAsset)
    url.searchParams.append('fiat_currency', fiatCurrency)
    url.searchParams.append('cryptoamount_amount', amount.toString())

    if (refundAddress) url.searchParams.append('address', refundAddress)
    if (config.network) url.searchParams.append('network', config.network)

    return url.toString()
  }

  /**
   * @param {'buy' | 'sell'} direction
   * @param {string} txId - The transaction ID from MoonPay.
   * @returns {Promise<WdkRampTransactionDetail>}
   */
  async getTransactionDetail(direction, txId) {
    if (!['buy', 'sell'].includes(direction)) {
      throw new Error('Invalid direction')
    }

    const path = direction === 'buy' ? `v1/transactions/${txId}` : `v3/sell_transactions/${txId}`

    const url = new URL(path, MOONPAY_API_DOMAIN)

    url.searchParams.append('apiKey', this._apiKey)

    const resp = await fetch(url.toString(), {
      headers: {
        accept: 'application/json'
      }
    })

    const moonPayTransaction = await resp.json()
    const moonPayCryptoAsset = direction === 'buy' ? moonPayTransaction.currencyId : moonPayTransaction.baseCurrencyId
    const wdkCryptoAsset = findWdkAssetKey(moonPayCryptoAsset, 'moonpay')

    return {
      status: toWdkStatus(moonPayTransaction.status),
      feeAmount: moonPayTransaction.feeAmount,
      cryptoAsset: wdkCryptoAsset || moonPayCryptoAsset, // fallback to moonPay asset to avoid unnecessary error
      fiatCurrency: direction === 'buy' ? moonPayTransaction.baseCurrencyId : moonPayTransaction.quoteCurrencyId,
      metadata: moonPayTransaction
    }
  }

}