import Route from '@ioc:Adonis/Core/Route'

//Cadastro
Route.post('/users/register', 'Users/Register.store')
Route.get('/users/register/:key', 'Users/Register.show')
Route.put('/users/register', 'Users/Register.update')

//Recuperação de senha
Route.post('/users/forgot-password', 'Users/ForgotPasswords.store')
Route.get('/users/forgot-password/:key', 'Users/ForgotPasswords.show')
Route.put('/users/forgot-password/', 'Users/ForgotPasswords.update')
