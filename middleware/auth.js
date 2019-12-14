export default function ({ store, route, redirect }, next) {
  const toAccount = route.fullPath.includes('/account')
  const account = store.state.account
  if (toAccount && !account) {
    redirect('/')
  } else {
    next()
  }
}
