import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register/Index'
import { User, UserKey } from 'App/Models/Index'
import faker from 'faker'
import mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserRegistersController {
  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)

      const user = new User()

      user.useTransaction(trx)

      user.email = email

      await user.save()

      const key = faker.datatype.uuid() + user.id

      user.related('keys').create({ key })

      const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

      //envio do email

      await mail.send((message) => {
        message.to(email)
        message.from('contato@teste.com', 'Teste')
        message.subject('Criação de conta')
        message.htmlView('emails/register', { link })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)

    await userKey.load('user')

    const user = userKey.user

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)

    await userKey.load('user')

    const user = userKey.user

    const username = name.split(' ')[0].toLowerCase() + new Date().getTime()

    user.merge({ name, password, username })

    await user.save()

    await userKey.delete()

    return response.ok({ message: 'Usuário criado com sucesso!' })
  }
}
