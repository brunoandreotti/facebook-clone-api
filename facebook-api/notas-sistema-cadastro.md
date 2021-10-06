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
Uma vez que o usuário terá a 'chave única' será necassário criar uma migration/tabela para essa chave.
Essa tabela estará em database/migrations/user_keys

Após criar a tabela será necessário configurar os models de 'user' e 'UserKey' baseados nas migrations, colocando também os relacionamentos
Os models estão em app/models

Após configurar os models será necessário criar os validators das rotas de cadastro de usuário.
Esses validators estão em app/validators/user/register

StoreValidator:
email deve ser uma string, um email e único na tabela 'users' na coluna 'email'
redirectUrl





Após configurar os validators, será necessário criar o controller de cadastro
Este controller terá as rotas 'store', 'show', 'update'
O controller está em app/controlers/users/register

O front-end começará o cadastro criando um usuário(store), após isso será feita uma requisição para mostrar/verificar a 'chave única'(show) e depois o cadastro será concluído com a atualização dos dados do usuário(update)

as rotas estão em start/routes/users

Rota store:
Essa rota terá um validator que está em app/validators/user/register/StoreValidator
Primeiro é pego o 'email' e o 'redirectUrl'(que será o url de redirecionamento que estará no email) da requisição
Depois é criado um usuário contendo e email e em seguida esse usuário é salvo no banco de dados
Depois é gerada a 'chave única' do cadastro e o link que será enviado no email
Para gerar o email será utilizado a 'camada view' do adonis
Para isso é necessário instalar 'npm i @adonisjs/view'
Para o envio do email será necessáro instalar 'npm i @adonisjs/mail
Depois o email é enviado

Rota show (validação da key):
Nessa rota será feita a validação da 'chave única' utilizada para o cadastro do usuário

Primeiramente é recuperada a 'UserKey' do model 'UserKey' e armazenado em uma constante
Depois é armazenado o usuário referente à key, éprocurado na banco de dados o primeiro usuário que possui a key que foi gerada.

Rota update:
Essa rota será responsável em atualizar os dados no usuário que foi criado no banco de dados, agora que a 'key' foi validada, será possível continuar o cadastro informando o restante dos dados necessários.
Essa rota terá um validator que está em app/validators/user/register/UpdateValidator

Primeiramente será validado o key, name, password vindo da request 
Depois será validado se a 'key' criada para esse usuário existe e com a key será retornado o usuário em sí.
Depois é gerado um username randômico
Depois é mesclado as informações do usuário contidas no banco de dados (que nesse caso é somente o email) com as informações do usuário vindas da requisição
Depois o usuário atualizado é salvo novamente no banco de dados
Por último a chave utilizada para validar o cadastro do usuário pe deletada, uma vez que a função dela foi fazer a validação do cadastro





