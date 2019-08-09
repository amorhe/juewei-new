import { ajax } from './li-ajax'

/**
 * @function 获取目录
 */
export const reqCategory = type => ajax('/mini/vip/wap/category/category', { type }, 'POST')

/**
 * @function 获取banner图
 */
export const reqBanner = bannerListOption => ajax('/mini/vip/wap/banner/banner_list', bannerListOption)

/**
 * @function 获取商品列表
 */

export const reqGoodsList = goodslistOption => ajax('/mini/vip/wap/goods/goods_list', goodslistOption)

/**
 * @function getPositionList
 */
export const reqPositionList = positionListOption => ajax('/mini/vip/wap/show_position/list', positionListOption)

/**
* @function 获取用户积分
*/
export const reqUserPoint = () => ajax('/mini/user/user_point')


/**
 * @function 获取礼包列表
 */
export const reqCouponsList = (get_type = 'new_user') => ajax('/mini/coupons/list', { get_type })

/**
* @function 获取当商品面详情
*/
export const reqDetail = id => ajax('/mini/vip/wap/goods/goods_detail', { id })

/**
* @function 创建订单
*/

export const reqCreateOrder = params => ajax('/mini/vip/wap/trade/create_order', params)