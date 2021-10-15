import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/User/ForgotPassword'
import { User, UserKey } from 'App/Models/Index'
import faker from 'faker'
import mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ForgotPasswordsController {
  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)

      const user = await User.findByOrFail('email', email)

      const key = faker.datatype.uuid() + user.id

      user.related('keys').create({ key })

      user.useTransaction(trx)

      const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

      //envio do e-mail

      await mail.send((message) => {
        message.to(email)
        message.from('contato@teste.com', 'Teste')
        message.subject('Recupereção de senha')
        message.htmlView('emails/forgotpassword', { link })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)

    await userKey.load('user')

    const user = userKey.user

    return user
  }

  public async update({}: HttpContextContract) {}
}
