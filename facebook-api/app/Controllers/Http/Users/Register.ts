import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/User/Register/Index'
import { User } from 'App/Models/Index'
import faker from 'faker'
import mail from '@ioc:Adonis/Addons/Mail'

export default class UserRegistersController {
  public async store({ request }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)

    const user = await User.create({ email })

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
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}
}
