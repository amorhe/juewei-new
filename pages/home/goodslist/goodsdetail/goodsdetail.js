import {imageUrl} from '../../../common/js/baseUrl'
Page({
  data: {
    activeTab:0,
    tabActive:0,
    tabs: [
      {
        title: '商品简介'
      },
      {
        title: '商品详情'
      }
    ],
    tabsT: [
       {
        title: '商品口味'
      },
      {
        title: '配送服务'
      }
    ],
    imageUrl,
    // 评论
    commentArr:[
      {
        imgAvatar:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1025011724,3729989080&fm=27&gp=0.jpg',
        name:'绝味1',
        star:5,
        comment_time:'2019.06.19 12:28',
        comment_text:'第一次订这个，味道超级好',
        imgUrls:['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=780072152,3543775531&fm=26&gp=0.jpg','https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1578146793,4217461747&fm=26&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1549818796,3596703153&fm=26&gp=0.jpg']
      },
      {
        imgAvatar:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=311097710,965735535&fm=27&gp=0.jpg',
        name:'绝味2',
        star:3,
        comment_time:'2019.06.19 12:28',
        comment_text:'第一次订这个，味道超级好',
        imgUrls:['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=780072152,3543775531&fm=26&gp=0.jpg']
      },
      {
        imgAvatar:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=311097710,965735535&fm=27&gp=0.jpg',
        name:'绝味2',
        star:3,
        comment_time:'2019.06.19 12:28',
        comment_text:'第一次订这个，味道超级好',
        imgUrls:[]
      }
    ]
  },
  onLoad() {},
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  tabChange({index}) {
    this.setData({
      tabActive: index,
    });
  }
});
