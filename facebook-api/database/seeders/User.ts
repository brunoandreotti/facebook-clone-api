import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { User } from 'App/Models/Index'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      email: 'teste4@teste.com',
      password: 'teste',
    })
  }
}
