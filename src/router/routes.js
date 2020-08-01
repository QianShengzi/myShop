export const routes = [
  {
    path: '/register',
    name: 'Register',
    component: r => require(['../views/Register.vue'], r)
  },
  {
    path: '/login',
    name: 'Login',
    component: r => require(['../views/login.vue'], r)
  },
  {
    path: '/aaaa',
    name: 'AAAA',
    component: r => require(['../views/aaaa.vue'], r)
  },
  {
    path: '/details',
    name: 'Details',
    component: r => require(['../views/details.vue'], r)
  },
  {
    path: '/address',
    name: 'Address',
    component: r => require(['../views/address.vue'], r)
  },
  {
    path: '/myaddress',
    name: 'MyAddress',
    component: r => require(['../views/myAddress.vue'], r)
  },
  {
    path: '/collect',
    name: 'Collect',
    component: r => require(['../views/collect.vue'], r)
  },
  {
    path: '/submitOrder',
    name: 'SubmitOrder',
    component: r => require(['../views/submitOrder.vue'], r)
  },
  {
    path: '/userinfomanage',
    name: 'userInfoManage',
    component: r => require(['../views/userInfoManage.vue'], r)
  },
  {
    path: '/safe',
    name: 'Safe',
    component: r => require(['../views/safe.vue'], r)
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: r => require(['../views/forgot.vue'], r)
  },
  {
    path: '/main',
    name: 'Main',
    component: r => require(['../views/main.vue'], r),
    children: [
      {
        path: '/',
        name: 'MyShop',
        component: r => require(['../views/main/shop.vue'], r)
      },
      {
        path: 'found',
        name: 'Found',
        component: r => require(['../views/main/found.vue'], r)
      },
      {
        path: 'shopcart',
        name: 'ShopCart',
        component: r => require(['../views/main/shopcart.vue'], r)
      },
      {
        path: 'my',
        name: 'My',
        component: r => require(['../views/main/my.vue'], r)
      },
      {
        path: 'order',
        name: 'Order',
        component: r => require(['../views/main/order.vue'], r)
      }
    ]
  },
  {
    path: '*',
    redirect: {
      name: 'Main'
    }
  }
]