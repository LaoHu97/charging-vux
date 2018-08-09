
import instance from './api'

let preUrlPath = ''

export const getPayOpenId = params => { return instance.post(`${preUrlPath}/pay/hardware/pay/getPayOpenId`, params).then(res => res.data) }

export const getPrepayInfo = params => { return instance.post(`${preUrlPath}/pay/hardware/pay/getPrepayInfo`, params).then(res => res.data) }

export const getCardOpenid = params => { return instance.post(`${preUrlPath}/pay/hardware/pay/getCardOpenid`, params).then(res => res.data) }

export const queryOtpCode = params => { return instance.post(`${preUrlPath}/pay/hardware/pay/queryOtpCode`, params).then(res => res.data) }
