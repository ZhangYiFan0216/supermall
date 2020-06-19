import{
    ADD_COUNTER,
    ADD_TO_CART
}from './mutations-types'

export default{
    // mutations唯一的目的就是修改state中的状态
   [ADD_COUNTER](state,payload){
        oldProduct.count += 1
    },
   [ADD_TO_CART](state, payload){
        payload.checked = false
        state.cartList.push(payload)
    }
}