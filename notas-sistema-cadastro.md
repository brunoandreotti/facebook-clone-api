-------------------------- Sistema de cadastro/Login/Logout/ ------------------------------

=================================== Login e Logout ========================================
Primeiramente é necessário instalar o pacote de auteticação e fazer usa configuração:
Lucid, api, User, true, databse, true

Após isso será necessário criar validators das rotas de autenticação
Nesse caso na rota de 'store' da auteticação, o front-end deverá enviar um email (que deverá ser uma string e um email) e uma senha(que deverá ser uma string).
O validator dessa rota está em app/validators/auth/storevalidator.ts

Após criar o validator das rotas de autenticação, será necessário criar o controller da autenticação.
Este controller somente terá as rotas de 'store(login)' e 'destroy(logout)', o usuário quando fizer o login estará criando/armazenando um token e quando fizer o logout estará deletando o token.
Esse controller está em app/controllers/http/auth/main.ts

Após criar o controller é necassario configurar as rotas da auteticação.
As rotas da auteticação estão em start/routes/auth.ts


=================================== Cadastro ========================================

Primeiramente terá um pré-cadastro para verificar se a pessoa possui acesso ao email que ela informou para o cadastro.

Após o usuário enviar o email, na API será criado um novo usuário quee possuirá uma 'chave única' que será utilizada sempre que o usuário precisar fazer alguma alteração em seus dados (na sua tabela) e essa cheva que será resposável por verificar se aquele usuário realmente possui autorização para alterar seus dados. Essa chave não ficará na tabela de usuários, e sim em outras, pois um usuário poderá ter várias 'chaves únicas', dessa forma a tabela de usuário terá um relacionamento com a tabela de chaves.

uma UserKey pertence a (Belongs to) um User

e um User poder ter muitas (Has Many) UserKey

Após a chave ser gerada, será enviado um email de confirmação para o email cadastrado, com o link de confirmação e é importante que o link possua a chave que foi gerada
 https://exemplo.com/register/chave-unica

Após clicar no link, o front-end fará uma consulta na API utilizando o parâmetro na URL para verificar se a chave existe no banco de dados, se a chave existir, o usuário será redirecionado para a página de cadastro, caso a chave não exista, será informado um erro.

Após o usuário finalizar seu cadastro, a 'chave única' de cadastro deverá ser destruída, uma vez que ela somente foi criada para verificar o cadastro do usuário.

-------------------------------------------------------------------------------------------
Uma vez que p usuário terá a 'chave única' será necassário criar uma migration/tabela para essa chave.
Essa tabela estará em database/migrations/user_keys

Após criar a tabela será necessário configurar os models de 'user' e 'UserKey' baseados nas migrations, colocando também os relacioamentos
Os models estão em app/models

Após configurar os models será necessário criar os validators das rotas de cadastro de usuário.
Esses validators estão em app/validators/user/register




Após configurar os validators, será necessário criar o controller de cadastro
Este controller terá as rotas 'store', 'show', 'update'

O front-end começará o cadastro criando um usuário(store), após isso será feita uma requisição para mostrar/verificar a 'chave única'(show) e depois o cadastro será concluído com a atualização dos dados do usuário(update)

Rota store:
Primeiro é pego o 'email' e o 'redirectUrl'(que será o url de redirecionamento que estará no email) da requisição
Depois é criado um usuário contendo e email e em seguida esse usuário é salvo no banco de dados
Depois é gerada a 'chave única' do cadastro e o link que será enviado no email
Para gerar o email será utilizado a 'camada view' do adonis
Para isso é necessário instalar 'npm i @adonisjs/view'
Para o envio do email será necessáro instalar 'npm i @adonisjs/mail
Depois o email é enviado



