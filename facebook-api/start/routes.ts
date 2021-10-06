import Route from '@ioc:Adonis/Core/Route'

import './routes/auth'
import './routes/users'

Route.get('/user-register', async ({ view }) => {
  return view.render('emails/register.edge')
})
